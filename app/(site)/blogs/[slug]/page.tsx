import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLink, ButtonLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs } from '@/components/ui'
import { absolute, getDoc, getPost, getPosts, getServices, readingMinutes } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

// Known posts are prerendered; new ones render on first visit and are then cached.
export const generateStaticParams = async () => (await getPosts()).map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [post, settings] = await Promise.all([getPost((await params).slug), getDoc('settings')])
  if (!post) return {}
  const path = `/blogs/${post.slug}`
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  return {
    title,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: settings.name,
      title,
      description,
      url: path,
      images: [{ url: post.ogImage || post.imageSrc, alt: post.imageAlt }],
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
    },
  }
}

export default async function Article({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const [settings, services] = await Promise.all([getDoc('settings'), getServices()])
  const service = services.find(s => post.serviceId && s._id.equals(post.serviceId))
  const path = `/blogs/${post.slug}`
  const url = siteUrl()
  const label = `${post.category ? `${post.category} · ` : ''}${readingMinutes(post)} min read`
  const org = { '@type': 'Organization', name: settings.name, url }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [absolute(post.imageSrc)],
    url: `${url}${path}`,
    mainEntityOfPage: `${url}${path}`,
    ...(post.category && { articleSection: post.category }),
    ...(post.tags.length && { keywords: post.tags.join(', ') }),
    author: post.author ? { '@type': 'Person', name: post.author } : org,
    publisher: { ...org, logo: { '@type': 'ImageObject', url: absolute(settings.logo.src) } },
    ...(post.publishedAt && { datePublished: post.publishedAt.toISOString() }),
    dateModified: post.updatedAt.toISOString(),
  }

  return (
    <>
      <PageIntro label={label} lines={[post.title]} image={{ src: post.imageSrc, alt: post.imageAlt }}>
        <p>{post.excerpt}</p>
      </PageIntro>

      <article className="section tone-light article">
        <div className="shell article-grid">
          <div className="article-body">
            <Media image={{ src: post.imageSrc, alt: post.imageAlt }} sizes="(max-width: 900px) 100vw, 60vw" className="article-media" />
            {post.body.map((block, n) =>
              block.type === 'h2' ? <h2 key={n}>{block.text}</h2>
              : block.type === 'ul' ? <ul key={n}>{block.text.split('\n').filter(Boolean).map(li => <li key={li}>{li}</li>)}</ul>
              : <p key={n}>{block.text}</p>,
            )}
            <ArrowLink href="/blogs">Back to all articles</ArrowLink>
          </div>
          {service && (
            <aside className="article-aside" aria-label="Related service">
              <Reveal>
                <Label>Related service</Label>
                <h2>{service.title}</h2>
                <p>{service.summary}</p>
                <ButtonLink href={service.href}>{service.ctaLabel}</ButtonLink>
              </Reveal>
            </aside>
          )}
        </div>
      </article>

      <ClosingCTA />
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbs([['Blogs', '/blogs'], [post.title, path]])} />
    </>
  )
}
