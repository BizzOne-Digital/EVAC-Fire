import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLink, ButtonLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs } from '@/components/ui'
import { postBySlug, posts, readingMinutes, serviceBySlug } from '@/lib/content'
import { contactHref, site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug)
  if (!post) return {}
  const path = `/blogs/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, url: path, images: [{ url: post.image.src, alt: post.image.alt }], ...(post.published && { publishedTime: post.published }) },
  }
}

export default async function Article({ params }: Props) {
  const post = postBySlug((await params).slug)
  if (!post) notFound()
  const service = serviceBySlug(post.service)!
  const path = `/blogs/${post.slug}`

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.image.src],
    url: `${site.url}${path}`,
    mainEntityOfPage: `${site.url}${path}`,
    articleSection: post.category,
    author: { '@type': 'Organization', name: site.name, url: site.url },
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.logo.src } },
    ...(post.published && { datePublished: post.published }),
  }

  return (
    <>
      <PageIntro label={`${post.category} · ${readingMinutes(post)} min read`} lines={[post.title]} image={post.image}>
        <p>{post.excerpt}</p>
      </PageIntro>

      <article className="section tone-light article">
        <div className="shell article-grid">
          <div className="article-body">
            <Media image={post.image} sizes="(max-width: 900px) 100vw, 60vw" className="article-media" />
            {post.body.map((block, n) =>
              'h2' in block ? <h2 key={n}>{block.h2}</h2> : 'p' in block ? <p key={n}>{block.p}</p> : <ul key={n}>{block.ul.map(li => <li key={li}>{li}</li>)}</ul>,
            )}
            <ArrowLink href="/blogs">Back to all articles</ArrowLink>
          </div>
          <aside className="article-aside" aria-label="Related service">
            <Reveal>
              <Label>Related service</Label>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <ButtonLink href={contactHref(service.slug)}>{service.cta}</ButtonLink>
            </Reveal>
          </aside>
        </div>
      </article>

      <ClosingCTA />
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbs([['Blogs', '/blogs'], [post.title, path]])} />
    </>
  )
}
