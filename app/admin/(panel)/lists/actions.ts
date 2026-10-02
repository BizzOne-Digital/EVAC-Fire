'use server'

import { redirect } from 'next/navigation'
import type { FormState } from '@/components/admin/form'
import { invalid, nextSortOrder, parseForm, refreshSite, reorder, saved } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { listItemSchema } from '@/lib/cms-schema'
import { collections, oid } from '@/lib/db'
import { LISTS, type ListKind } from './config'

async function col(kind: ListKind) {
  if (!Object.hasOwn(LISTS, kind)) throw new Error('Unknown list')
  return (await collections())[kind]
}

export async function saveListItem(kind: ListKind, id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin()
  const { data, errors } = parseForm(listItemSchema, fd)
  if (errors) return invalid(errors)
  const c = await col(kind)
  if (id) {
    const _id = oid(id)
    if (!_id || !(await c.updateOne({ _id }, { $set: { ...data, updatedAt: new Date() } })).matchedCount) return { ok: false, message: 'This item no longer exists.' }
  } else {
    await c.insertOne({ ...data, sortOrder: await nextSortOrder(c), updatedAt: new Date() } as never)
  }
  refreshSite()
  if (!id) redirect(`/admin/${kind}`)
  return saved()
}

export async function toggleListItem(kind: ListKind, id: string) {
  await requireAdmin()
  const c = await col(kind)
  const item = oid(id) && (await c.findOne({ _id: oid(id)! }))
  if (!item) return { ok: false, message: 'Item not found.' }
  await c.updateOne({ _id: item._id }, { $set: { published: !item.published, updatedAt: new Date() } })
  refreshSite()
  return { ok: true, message: item.published ? 'Hidden from the website.' : 'Published.' }
}

export async function moveListItem(kind: ListKind, id: string, dir: -1 | 1) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id || !(await reorder(await col(kind), _id, dir === 1 ? 1 : -1))) return { ok: false, message: 'Already at the end of the list.' }
  refreshSite()
  return { ok: true }
}

export async function deleteListItem(kind: ListKind, id: string) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id || !(await (await col(kind)).deleteOne({ _id })).deletedCount) return { ok: false, message: 'Item not found.' }
  refreshSite()
  return { ok: true, message: 'Deleted.' }
}
