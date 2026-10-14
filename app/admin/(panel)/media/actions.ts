'use server'

import { Binary } from 'mongodb'
import { refreshSite } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { collections, ObjectId, oid, type Media } from '@/lib/db'

const MAX_BYTES = 4 * 1024 * 1024 // Vercel caps request bodies at 4.5 MB.

// Content type is decided from the file's first bytes, never from the browser's claim. SVG is refused (it can carry scripts).
function sniff(b: Buffer) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (b.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif'
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp'
  if (b.subarray(4, 12).toString('latin1') === 'ftypavif') return 'image/avif'
  return null
}

const toPicked = (m: Pick<Media, '_id' | 'url' | 'filename' | 'alt' | 'width' | 'height'>) => ({ id: String(m._id), url: m.url, filename: m.filename, alt: m.alt, width: m.width, height: m.height })
const cleanName = (n: string) => n.replace(/[^\w.\- ]+/g, '').slice(0, 120) || 'image'

export async function listMedia() {
  await requireAdmin()
  const rows = await (await collections()).media.find({}, { projection: { data: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray()
  return rows.map(toPicked)
}

async function store(file: File, size: string) {
  if (file.size > MAX_BYTES) throw new UserError(`${file.name} is larger than 4 MB. Resize it and try again.`)
  const bytes = Buffer.from(await file.arrayBuffer())
  const contentType = sniff(bytes)
  if (!contentType) throw new UserError(`${file.name} is not a JPEG, PNG, WebP, GIF or AVIF image.`)
  const [w, h] = size.split('x').map(n => Number.parseInt(n))
  const _id = new ObjectId()
  const doc = {
    _id,
    url: `/media/${_id}`,
    filename: cleanName(file.name),
    contentType,
    size: bytes.length,
    width: w > 0 && w < 20000 ? w : null,
    height: h > 0 && h < 20000 ? h : null,
    alt: '',
    data: new Binary(bytes),
    createdAt: new Date(),
  }
  await (await collections()).media.insertOne(doc)
  return toPicked(doc)
}
class UserError extends Error {}

export async function uploadMedia(fd: FormData) {
  await requireAdmin()
  const files = fd.getAll('file').filter((f): f is File => f instanceof File && f.size > 0)
  if (!files.length) return { ok: false, message: 'Choose an image to upload.', items: [] }
  try {
    const items = []
    for (const [i, f] of files.entries()) items.push(await store(f, String(fd.get(`size.${i}`) ?? '')))
    return { ok: true, message: files.length === 1 ? 'Image uploaded.' : `${files.length} images uploaded.`, items }
  } catch (e) {
    if (!(e instanceof UserError)) console.error('[media] upload failed:', e)
    return { ok: false, message: e instanceof UserError ? e.message : 'Upload failed. Please try again.', items: [] }
  }
}

/** Every place an image URL is used: CMS documents, services and posts. */
async function usages(url: string) {
  const c = await collections()
  const docs = await c.content.find({}).toArray()
  const inDocs = docs.filter(d => JSON.stringify(d.data).includes(JSON.stringify(url))).map(d => d._id)
  const svc = await c.services.countDocuments({ imageSrc: url })
  const posts = await c.posts.countDocuments({ $or: [{ imageSrc: url }, { ogImage: url }] })
  return { docs: inDocs, count: inDocs.length + svc + posts }
}

export async function mediaUsage(id: string) {
  await requireAdmin()
  const m = oid(id) && (await (await collections()).media.findOne({ _id: oid(id)! }, { projection: { url: 1 } }))
  return m ? (await usages(m.url)).count : 0
}

export async function updateAlt(id: string, alt: string) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id) return { ok: false, message: 'Image not found.' }
  await (await collections()).media.updateOne({ _id }, { $set: { alt: alt.trim().slice(0, 300) } })
  return { ok: true, message: 'Alt text saved. New selections will use it.' }
}

export async function deleteMedia(id: string) {
  await requireAdmin()
  const _id = oid(id)
  const c = await collections()
  const m = _id && (await c.media.findOne({ _id }, { projection: { url: 1 } }))
  if (!m) return { ok: false, message: 'Image not found.' }
  const { count } = await usages(m.url)
  if (count) return { ok: false, message: `This image is used in ${count} place${count > 1 ? 's' : ''}. Replace it there first, or use “Replace”.` }
  await c.media.deleteOne({ _id: m._id })
  return { ok: true, message: 'Image deleted.' }
}

/** Uploads a new file and points every page, service and post that used the old image at it. */
export async function replaceMedia(id: string, fd: FormData) {
  await requireAdmin()
  const _id = oid(id)
  const c = await collections()
  const old = _id && (await c.media.findOne({ _id }, { projection: { data: 0 } }))
  const file = fd.get('file')
  if (!old || !(file instanceof File)) return { ok: false, message: 'Choose an image to upload.' }
  try {
    const next = await store(file, String(fd.get('size.0') ?? ''))
    await c.media.updateOne({ _id: oid(next.id)! }, { $set: { alt: old.alt } })
    const { docs } = await usages(old.url)
    for (const key of docs) {
      const d = await c.content.findOne({ _id: key })
      const data = JSON.parse(JSON.stringify(d!.data).replaceAll(JSON.stringify(old.url), JSON.stringify(next.url)))
      await c.content.updateOne({ _id: key }, { $set: { data, updatedAt: new Date() } })
    }
    await c.services.updateMany({ imageSrc: old.url }, { $set: { imageSrc: next.url } })
    await c.posts.updateMany({ imageSrc: old.url }, { $set: { imageSrc: next.url } })
    await c.posts.updateMany({ ogImage: old.url }, { $set: { ogImage: next.url } })
    await c.media.deleteOne({ _id: old._id })
    refreshSite()
    return { ok: true, message: 'Image replaced everywhere it was used.' }
  } catch (e) {
    if (!(e instanceof UserError)) console.error('[media] replace failed:', e)
    return { ok: false, message: e instanceof UserError ? e.message : 'Replace failed. Please try again.' }
  }
}
