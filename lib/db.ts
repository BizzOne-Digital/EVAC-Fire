// MongoDB Atlas access. No framework imports, so the seed script can use it too.
import { MongoClient, ObjectId, type Binary, type Db } from 'mongodb'

export { ObjectId }

type Timestamps = { createdAt: Date; updatedAt: Date }

export type User = { _id: ObjectId; email: string; name: string; passwordHash: string; failedLogins: number; lockedUntil: Date | null; createdAt: Date }
/** `_id` is the SHA-256 of the cookie token, so a leaked collection cannot be replayed as cookies. */
export type Session = { _id: string; userId: ObjectId; expiresAt: Date; createdAt: Date }
/** Singleton documents (settings, home, about, seo…). Shapes live in lib/cms-schema.ts. */
export type ContentDoc = { _id: string; data: unknown; updatedAt: Date }

export type Service = Timestamps & {
  _id: ObjectId
  slug: string
  title: string
  eyebrow: string
  lead: string
  summary: string
  body: string[]
  listTitle: string
  list: string[]
  closing: string
  ctaLabel: string
  /** Empty = the contact form with this service preselected. */
  ctaHref: string
  imageSrc: string
  imageAlt: string
  featured: boolean
  published: boolean
  sortOrder: number
}

export type PostBlock = { type: 'p' | 'h2' | 'ul'; text: string }
export type Post = Timestamps & {
  _id: ObjectId
  slug: string
  title: string
  excerpt: string
  body: PostBlock[]
  imageSrc: string
  imageAlt: string
  category: string
  tags: string[]
  author: string
  serviceId: ObjectId | null
  status: 'draft' | 'published'
  /** Null on a published post = no date shown. A future date schedules the post. */
  publishedAt: Date | null
  seoTitle: string
  seoDescription: string
  ogImage: string
}

/** "Who we serve" groups and "Our approach" items share one shape. */
export type ListItem = { _id: ObjectId; title: string; items: string[]; published: boolean; sortOrder: number; updatedAt: Date }

export const INQUIRY_STATUSES = ['new', 'contacted', 'in_progress', 'completed', 'archived'] as const
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]
export type Inquiry = Timestamps & {
  _id: ObjectId
  name: string
  email: string
  phone: string
  organization: string
  propertyType: string
  service: string
  /** Snapshot of the service name at submission, so renames and deletes keep history readable. */
  serviceLabel: string
  message: string
  status: InquiryStatus
  notes: string
  source: string
}

/**
 * Uploaded files keep their bytes in `data` and are served at `/media/<id>`.
 * Entries without data register an existing static or external image so it can be picked in editors.
 */
export type Media = { _id: ObjectId; url: string; filename: string; contentType: string; size: number; width: number | null; height: number | null; alt: string; data: Binary | null; createdAt: Date }

const g = globalThis as unknown as { evacMongo?: Promise<MongoClient> }

/** One client per server instance, reused across hot reloads and warm serverless invocations. */
export function client() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set. See .env.example.')
  return (g.evacMongo ??= new MongoClient(uri, { maxPoolSize: 10, appName: 'evac-website' }).connect())
}

export async function collections(db?: Db) {
  db ??= (await client()).db(process.env.MONGODB_DB || 'evac')
  return {
    users: db.collection<User>('users'),
    sessions: db.collection<Session>('sessions'),
    content: db.collection<ContentDoc>('content'),
    services: db.collection<Service>('services'),
    posts: db.collection<Post>('posts'),
    audiences: db.collection<ListItem>('audiences'),
    approach: db.collection<ListItem>('approach'),
    inquiries: db.collection<Inquiry>('inquiries'),
    media: db.collection<Media>('media'),
  }
}

export async function ensureIndexes() {
  const c = await collections()
  await Promise.all([
    c.users.createIndex({ email: 1 }, { unique: true }),
    c.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    c.services.createIndex({ slug: 1 }, { unique: true }),
    c.services.createIndex({ sortOrder: 1 }),
    c.posts.createIndex({ slug: 1 }, { unique: true }),
    c.posts.createIndex({ status: 1, publishedAt: -1 }),
    c.audiences.createIndex({ sortOrder: 1 }),
    c.approach.createIndex({ sortOrder: 1 }),
    c.inquiries.createIndex({ status: 1, createdAt: -1 }),
    c.inquiries.createIndex({ createdAt: -1 }),
    c.media.createIndex({ url: 1 }, { unique: true }),
  ])
}

/** Parses a route param into an ObjectId, or null for anything malformed. */
export const oid = (id: string) => (ObjectId.isValid(id) && String(new ObjectId(id)) === id ? new ObjectId(id) : null)
