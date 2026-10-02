// `npm run check`: reports database and admin-account status without printing any secret.
import { client, collections } from '../lib/db.ts'
import { verifyPassword } from '../lib/password.ts'

const c = await collections()
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const users = await c.users.find({}, { projection: { email: 1, lockedUntil: 1, failedLogins: 1 } }).toArray()

console.log('database name:          ', process.env.MONGODB_DB || 'evac (default)')
console.log('content seeded:         ', Boolean(await c.content.findOne({ _id: 'settings' })))
console.log('ADMIN_EMAIL set:        ', Boolean(email))
console.log('ADMIN_PASSWORD set:     ', Boolean(process.env.ADMIN_PASSWORD))
console.log('admin accounts:         ', users.map(u => u.email).join(', ') || 'none')
const user = email ? await c.users.findOne({ email }) : null
console.log('ADMIN_EMAIL has account:', Boolean(user))
if (user) {
  console.log('ADMIN_PASSWORD matches: ', process.env.ADMIN_PASSWORD ? await verifyPassword(process.env.ADMIN_PASSWORD, user.passwordHash) : 'n/a')
  console.log('locked out:             ', Boolean(user.lockedUntil && user.lockedUntil > new Date()))
}
await (await client()).close()
