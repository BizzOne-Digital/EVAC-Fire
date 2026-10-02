'use server'

import { redirect } from 'next/navigation'
import type { FormState } from '@/components/admin/form'
import { invalid, isDuplicate, parseForm, refreshSite, saved } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { postSchema } from '@/lib/cms-schema'
import { collections, oid } from '@/lib/db'

export async function savePost(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin()
  const { data, errors } = parseForm(postSchema, fd)
  if (errors) return invalid(errors)
  const c = await collections()
  const now = new Date()
  const doc = {
    ...data,
    serviceId: data.serviceId ? oid(data.serviceId) : null,
    // First publish without a chosen date: stamp it now so the post leads the blog list.
    publishedAt: data.publishedAt ?? (data.status === 'published' && fd.get('wasPublished') !== '1' ? now : null),
    updatedAt: now,
  }
  let newId
  try {
    if (id) {
      const _id = oid(id)
      if (!_id || !(await c.posts.updateOne({ _id }, { $set: doc })).matchedCount) return { ok: false, message: 'This post no longer exists.' }
    } else {
      newId = (await c.posts.insertOne({ ...doc, createdAt: now } as never)).insertedId
    }
  } catch (e) {
    if (isDuplicate(e)) return invalid({ slug: 'Another post already uses this URL slug.' })
    throw e
  }
  refreshSite()
  if (newId) redirect(`/admin/blogs/${newId}?created=1`)
  const scheduled = doc.status === 'published' && doc.publishedAt && doc.publishedAt > now
  return saved(doc.status === 'draft' ? 'Draft saved.' : scheduled ? 'Saved. The post goes live at its publish date (checked hourly).' : 'Post saved and live.')
}

export async function setPostStatus(id: string, status: 'draft' | 'published') {
  await requireAdmin()
  const _id = oid(id)
  const c = await collections()
  const post = _id && (await c.posts.findOne({ _id }, { projection: { publishedAt: 1 } }))
  if (!post) return { ok: false, message: 'Post not found.' }
  const publishedAt = status === 'published' ? (post.publishedAt ?? new Date()) : post.publishedAt
  await c.posts.updateOne({ _id: post._id }, { $set: { status, publishedAt, updatedAt: new Date() } })
  refreshSite()
  return { ok: true, message: status === 'published' ? 'Post published.' : 'Post moved to drafts.' }
}

export async function deletePost(id: string) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id || !(await (await collections()).posts.deleteOne({ _id })).deletedCount) return { ok: false, message: 'Post not found.' }
  refreshSite()
  return { ok: true, message: 'Post deleted.' }
}

export async function deletePostAndReturn(id: string) {
  const r = await deletePost(id)
  if (r.ok) redirect('/admin/blogs')
  return r
}
