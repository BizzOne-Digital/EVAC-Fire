import type { MetadataRoute } from 'next'
import { posts } from '@/lib/content'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/services', '/blogs', '/contact'].map(path => ({ url: `${site.url}${path}`, priority: path ? 0.8 : 1 }))
  const articles = posts.map(p => ({ url: `${site.url}/blogs/${p.slug}`, priority: 0.6, ...(p.published && { lastModified: p.published }) }))
  return [...pages, ...articles]
}
