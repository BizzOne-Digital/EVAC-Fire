'use server'

import type { FormState } from '@/components/admin/form'
import { endOtherSessions, requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/password'

export async function updateProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const name = String(fd.get('name') ?? '').trim().slice(0, 120)
  const email = String(fd.get('email') ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return { ok: false, message: 'Please fix the highlighted fields.', errors: { email: 'Enter a valid email address.' } }
  const c = await collections()
  if (await c.users.findOne({ email, _id: { $ne: admin.id } })) return { ok: false, message: 'Please fix the highlighted fields.', errors: { email: 'Another admin already uses this email.' } }
  await c.users.updateOne({ _id: admin.id }, { $set: { name, email } })
  return { ok: true, message: 'Profile updated. Use the new email next time you sign in.' }
}

export async function changePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const current = String(fd.get('current') ?? '')
  const next = String(fd.get('next') ?? '')
  const confirm = String(fd.get('confirm') ?? '')
  const c = await collections()
  const user = await c.users.findOne({ _id: admin.id })
  const errors: Record<string, string> = {}
  if (!user || !(await verifyPassword(current, user.passwordHash))) errors.current = 'Your current password is incorrect.'
  const problem = passwordProblem(next)
  if (problem) errors.next = problem
  else if (next !== confirm) errors.confirm = 'The new passwords do not match.'
  if (Object.keys(errors).length) return { ok: false, message: 'Please fix the highlighted fields.', errors }
  await c.users.updateOne({ _id: admin.id }, { $set: { passwordHash: await hashPassword(next) } })
  await endOtherSessions(admin.id)
  return { ok: true, message: 'Password changed. Other devices have been signed out.' }
}
