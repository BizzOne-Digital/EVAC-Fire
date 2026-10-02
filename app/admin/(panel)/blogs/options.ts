import { collections } from '@/lib/db'

/** Choices for the post editor: services to link and categories already in use. */
export async function postOptions() {
  const c = await collections()
  const [services, categories] = await Promise.all([
    c.services.find({}, { projection: { title: 1 } }).sort({ sortOrder: 1 }).toArray(),
    c.posts.distinct('category'),
  ])
  return { services: services.map(s => ({ value: String(s._id), label: s.title })), categories: categories.filter(Boolean).sort() }
}
