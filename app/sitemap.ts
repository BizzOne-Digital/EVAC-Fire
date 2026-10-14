import type { MetadataRoute } from 'next'
import { getDoc, getPosts } from '@/lib/cms'
import type { PageKey } from '@/lib/cms-schema'
import { siteUrl } from '@/lib/site'

export const revalidate = 3600

const PAGES: [PageKey, string][] = [['home', ''], ['about', '/about'], ['services', '/services'], ['blogs', '/blogs'], ['contact', '/contact']]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, posts] = await Promise.all([getDoc('seo'), getPosts()])
  const url = siteUrl()
  const pages = PAGES.filter(([k]) => !seo.pages[k].noindex).map(([, path]) => ({ url: `${url}${path}`, priority: path ? 0.8 : 1 }))
  const articles = posts.map(p => ({ url: `${url}/blogs/${p.slug}`, priority: 0.6, lastModified: p.updatedAt }))
  return [...pages, ...articles]
}
