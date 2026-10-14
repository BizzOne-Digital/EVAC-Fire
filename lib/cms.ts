// Read side of the CMS for public pages. React `cache` dedupes queries within one render;
// rendered pages are cached by Next and refreshed by `revalidatePath` whenever the admin saves.
import type { Metadata } from 'next'
import { cache } from 'react'
import { collections, type Post, type Service } from './db'
import type { Doc, DocKey, PageKey } from './cms-schema'
import { contactHref, siteUrl } from './site'

export type Img = { src: string; alt: string }

export const getDoc = cache(async <K extends DocKey>(key: K): Promise<Doc<K>> => {
  const doc = await (await collections()).content.findOne({ _id: key })
  if (!doc) throw new Error(`CMS content "${key}" is missing. Run \`npm run seed\`.`)
  return doc.data as Doc<K>
})

export type PublicService = Service & { number: string; href: string }

export const getServices = cache(async (): Promise<PublicService[]> => {
  const rows = await (await collections()).services.find({ published: true }).sort({ sortOrder: 1, _id: 1 }).toArray()
  return rows.map((s, i) => ({ ...s, number: String(i + 1).padStart(2, '0'), href: s.ctaHref || contactHref(s.slug) }))
})

const live = () => ({ status: 'published' as const, $or: [{ publishedAt: null }, { publishedAt: { $lte: new Date() } }] })

export const getPosts = cache(async () => (await collections()).posts.find(live()).sort({ publishedAt: -1, _id: 1 }).toArray())
export const getPost = cache(async (slug: string) => (await collections()).posts.findOne({ slug, ...live() }))

export const getAudiences = cache(async () => (await collections()).audiences.find({ published: true }).sort({ sortOrder: 1, _id: 1 }).toArray())
export const getApproach = cache(async () => (await collections()).approach.find({ published: true }).sort({ sortOrder: 1, _id: 1 }).toArray())

export function readingMinutes(post: Pick<Post, 'body'>) {
  const words = post.body.map(b => b.text).join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** Page metadata from SEO Settings, falling back to the site defaults. */
export async function pageMetadata(key: PageKey, path: string): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getDoc('seo'), getDoc('settings')])
  const page = seo.pages[key]
  const description = page.description || seo.defaults.description
  const title = page.title || undefined
  return {
    title,
    description,
    alternates: { canonical: page.canonical || path },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      siteName: settings.name,
      locale: 'en_CA',
      url: path,
      title: page.title || seo.defaults.title,
      description,
      images: [page.ogImage || seo.defaults.ogImage || '/og'],
    },
  }
}

export const absolute = (src: string) => (src.startsWith('http') ? src : `${siteUrl()}${src}`)
