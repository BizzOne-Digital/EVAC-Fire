'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/components/admin/form'
import { requireAdmin } from '@/lib/auth'
import { INQUIRY_STATUSES, collections, oid, type InquiryStatus } from '@/lib/db'

export async function updateInquiry(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin()
  const _id = oid(id)
  const status = String(fd.get('status')) as InquiryStatus
  const notes = String(fd.get('notes') ?? '').trim()
  if (!INQUIRY_STATUSES.includes(status)) return { ok: false, message: 'Choose a status.', errors: { status: 'Choose a status.' } }
  if (notes.length > 5000) return { ok: false, message: 'Notes are too long.', errors: { notes: 'Keep notes under 5,000 characters.' } }
  if (!_id || !(await (await collections()).inquiries.updateOne({ _id }, { $set: { status, notes, updatedAt: new Date() } })).matchedCount) {
    return { ok: false, message: 'This inquiry no longer exists.' }
  }
  revalidatePath('/admin', 'layout')
  return { ok: true, message: 'Inquiry updated.' }
}

export async function deleteInquiry(id: string) {
  await requireAdmin()
  const _id = oid(id)
  if (!_id || !(await (await collections()).inquiries.deleteOne({ _id })).deletedCount) return { ok: false, message: 'Inquiry not found.' }
  redirect('/admin/inquiries')
}
