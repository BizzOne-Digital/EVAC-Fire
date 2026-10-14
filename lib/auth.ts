// Admin sessions: random token in an httpOnly cookie, SHA-256 of it stored in MongoDB (TTL-indexed).
// Every admin page and server action calls requireAdmin(); proxy.ts only adds an early redirect.
import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { collections, type ObjectId } from './db'
import { hashPassword, verifyPassword } from './password'

export const SESSION_COOKIE = 'evac_admin'
const SESSION_DAYS = 7
const MAX_FAILURES = 5
const LOCK_MINUTES = 15

const digest = (token: string) => createHash('sha256').update(token).digest('hex')

export type Admin = { id: ObjectId; email: string; name: string }

export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const c = await collections()
  const session = await c.sessions.findOne({ _id: digest(token), expiresAt: { $gt: new Date() } })
  if (!session) return null
  const user = await c.users.findOne({ _id: session.userId }, { projection: { email: 1, name: 1 } })
  return user ? { id: user._id, email: user.email, name: user.name } : null
})

export async function requireAdmin() {
  return (await getAdmin()) ?? redirect('/admin/login')
}

async function startSession(userId: ObjectId) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5)
  await (await collections()).sessions.insertOne({ _id: digest(token), userId, expiresAt, createdAt: new Date() })
  ;(await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: expiresAt })
}

// Spent on unknown emails too, so response time does not reveal which accounts exist.
const DUMMY_HASH = hashPassword('not-a-real-password')

export async function login(emailInput: string, password: string): Promise<'ok' | 'invalid' | 'locked'> {
  const email = emailInput.trim().toLowerCase()
  const c = await collections()
  const user = await c.users.findOne({ email })
  if (!user) {
    await verifyPassword(password, await DUMMY_HASH)
    return 'invalid'
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) return 'locked'
  if (!(await verifyPassword(password, user.passwordHash))) {
    const failures = user.failedLogins + 1
    const lock = failures >= MAX_FAILURES
    await c.users.updateOne({ _id: user._id }, { $set: { failedLogins: lock ? 0 : failures, lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 6e4) : null } })
    return lock ? 'locked' : 'invalid'
  }
  await c.users.updateOne({ _id: user._id }, { $set: { failedLogins: 0, lockedUntil: null } })
  await startSession(user._id)
  return 'ok'
}

export async function logout() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) await (await collections()).sessions.deleteOne({ _id: digest(token) })
  jar.delete(SESSION_COOKIE)
}

/** After a password change: sign out every other device. */
export async function endOtherSessions(userId: ObjectId) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  await (await collections()).sessions.deleteMany({ userId, _id: { $ne: token ? digest(token) : '' } })
}
