'use server'

import { redirect } from 'next/navigation'
import { login, logout } from '@/lib/auth'

export async function signIn(_prev: { error: string; email: string }, fd: FormData) {
  const email = String(fd.get('email') ?? '').slice(0, 200)
  const password = String(fd.get('password') ?? '').slice(0, 200)
  if (!email || !password) return { error: 'Enter your email and password.', email }
  const result = await login(email, password)
  if (result === 'locked') return { error: 'Too many failed attempts. Try again in 15 minutes.', email }
  if (result === 'invalid') return { error: 'Email or password is incorrect.', email }
  redirect('/admin')
}

export async function signOut() {
  await logout()
  redirect('/admin/login')
}
