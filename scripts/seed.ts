// `npm run seed`: creates indexes, loads the existing website content and the first admin account.
// Safe to re-run: everything is insert-if-missing, so edits made in the admin are never overwritten,
// and content the admin deleted is not brought back (a marker records that the first seed ran).
import { client, collections, ensureIndexes } from '../lib/db.ts'
import { documents, type DocKey } from '../lib/cms-schema.ts'
import { hashPassword, passwordProblem } from '../lib/password.ts'
import { approachSeed, audiencesSeed, documentsSeed, mediaSeed, postsSeed, servicesSeed } from './seed-data.ts'

const now = new Date()
const c = await collections()

await ensureIndexes()
console.log('✓ indexes')

// Documents are checked against the same schemas the admin forms use.
for (const key of Object.keys(documentsSeed) as DocKey[]) {
  const data = documents[key].parse(documentsSeed[key])
  const r = await c.content.updateOne({ _id: key }, { $setOnInsert: { data, updatedAt: now } }, { upsert: true })
  console.log(r.upsertedCount ? `✓ content: ${key}` : `· content: ${key} (exists, kept)`)
}

const marker = await c.content.findOne({ _id: '_seeded' })
if (marker) {
  console.log('· list content was seeded before; skipped so deleted items stay deleted')
} else {
  for (const m of mediaSeed) {
    await c.media.updateOne(
      { url: m.url },
      { $setOnInsert: { ...m, contentType: '', size: 0, width: m.width ?? null, height: m.height ?? null, data: null, createdAt: now } },
      { upsert: true },
    )
  }
  console.log(`✓ media library: ${mediaSeed.length} existing images`)

  for (const [i, s] of servicesSeed.entries()) {
    await c.services.updateOne(
      { slug: s.slug },
      { $setOnInsert: { ...s, ctaHref: '', featured: true, published: true, sortOrder: i, createdAt: now, updatedAt: now } },
      { upsert: true },
    )
  }
  console.log(`✓ services: ${servicesSeed.length}`)

  for (const { service, ...post } of postsSeed) {
    const svc = await c.services.findOne({ slug: service }, { projection: { _id: 1 } })
    await c.posts.updateOne(
      { slug: post.slug },
      {
        $setOnInsert: {
          ...post,
          tags: [],
          author: '',
          serviceId: svc?._id ?? null,
          status: 'published',
          publishedAt: null,
          seoTitle: '',
          seoDescription: '',
          ogImage: '',
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    )
  }
  console.log(`✓ blog posts: ${postsSeed.length}`)

  for (const [col, items] of [[c.audiences, audiencesSeed], [c.approach, approachSeed]] as const) {
    if (await col.countDocuments()) continue
    await col.insertMany(items.map((it, i) => ({ ...it, published: true, sortOrder: i, updatedAt: now })) as never)
  }
  console.log(`✓ who we serve: ${audiencesSeed.length}, our approach: ${approachSeed.length}`)

  await c.content.insertOne({ _id: '_seeded', data: { at: now }, updatedAt: now })
}

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD ?? ''
if (!email || !password) {
  console.warn('! ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin account created')
} else if (await c.users.findOne({ email })) {
  console.log(`· admin ${email} exists (password unchanged; change it under Admin Account)`)
} else {
  const problem = passwordProblem(password)
  if (problem) throw new Error(`ADMIN_PASSWORD: ${problem}`)
  await c.users.insertOne({ email, name: 'Administrator', passwordHash: await hashPassword(password), failedLogins: 0, lockedUntil: null, createdAt: now } as never)
  console.log(`✓ admin account: ${email}`)
}

await (await client()).close()
console.log('Seed complete.')
