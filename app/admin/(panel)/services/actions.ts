'use server'

import { redirect } from 'next/navigation'
import type { FormState } from '@/components/admin/form'
import { invalid, isDuplicate, nextSortOrder, parseForm, refreshSite, reorder, saved } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { serviceSchema } from '@/lib/cms-schema'
import { collections, oid } from '@/lib/db'

export async function saveService(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin()
  const { data, errors } = parseForm(serviceSchema, fd)
  if (errors) return invalid(errors)
  const c = await collections()
  const now = new Date()
  let newId
  try {
    if (id) {
      const _id = oid(id)
      if (!_id || !(await c.services.updateOne({ _id }, { $set: { ...data, updatedAt: now } })).matchedCount) return { ok: false, message: 'This service no longer exists.' }
    } else {
      newId = (await c.services.insertOne({ ...data, sortOrder: await nextSortOrder(c.services), createdAt: now, updatedAt: now } as never)).insertedId
    }
  } catch (e) {
    if (isDuplicate(e)) return invalid({ slug: 'Another service already uses this URL slug.' })
    throw e
  }
  refreshSite()
  if (newId) redirect(`/admin/services/${newId}?created=1`)
  return saved()
}

export async function toggleService(id: string) {
  await requireAdmin()
  const c = await collections()
  const s = oid(id) && (await c.services.findOne({ _id: oid(id)! }, { projection: { published: 1 } }))
  if (!s) return { ok: false, message: 'Service not found.' }
  await c.services.updateOne({ _id: s._id }, { $set: { published: !s.published, updatedAt: new Date() } })
  refreshSite()
  return { ok: true, message: s.published ? 'Service hidden from the website.' : 'Service published.' }
}

export async function moveService(id: string, dir: -1 | 1) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id || !(await reorder((await collections()).services, _id, dir === 1 ? 1 : -1))) return { ok: false, message: 'Already at the end of the list.' }
  refreshSite()
  return { ok: true }
}

export async function deleteService(id: string) {
  await requireAdmin()
  const _id = oid(id)
  const c = await collections()
  if (!_id || !(await c.services.deleteOne({ _id })).deletedCount) return { ok: false, message: 'Service not found.' }
  await c.posts.updateMany({ serviceId: _id }, { $set: { serviceId: null } })
  refreshSite()
  return { ok: true, message: 'Service deleted.' }
}

export async function deleteServiceAndReturn(id: string) {
  const r = await deleteService(id)
  if (r.ok) redirect('/admin/services')
  return r
}
