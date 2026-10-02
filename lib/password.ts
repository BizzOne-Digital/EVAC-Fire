// Password hashing with Node's built-in scrypt. No framework imports, so the seed script can use it.
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

const PARAMS = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
const KEYLEN = 64

const derive = (password: string, salt: Buffer, o: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scrypt(password.normalize('NFKC'), salt, KEYLEN, o, (e, k) => (e ? reject(e) : resolve(k))))

export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const key = await derive(password, salt, PARAMS)
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString('base64')}$${key.toString('base64')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [alg, N, r, p, salt, hash] = stored.split('$')
  if (alg !== 'scrypt' || !hash) return false
  const expected = Buffer.from(hash, 'base64')
  const key = await derive(password, Buffer.from(salt, 'base64'), { N: +N, r: +r, p: +p, maxmem: PARAMS.maxmem })
  return key.length === expected.length && timingSafeEqual(key, expected)
}

export const PASSWORD_MIN = 12
export const passwordProblem = (pw: string) =>
  pw.length < PASSWORD_MIN ? `Use at least ${PASSWORD_MIN} characters.` : pw.length > 200 ? 'Use at most 200 characters.' : null
