import Link from 'next/link'
import { ArrowLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs, rich } from '@/components/ui'
import { getDoc, getPosts, pageMetadata, readingMinutes } from '@/lib/cms'

export const generateMetadata = () => pageMetadata('blogs', '/blogs')

export default async function Blogs() {
  const [page, posts] = await Promise.all([getDoc('blogs'), getPosts()])

  return (
    <>
      <PageIntro label={page.intro.label} image={page.intro.image} lines={rich(page.intro.title)}>
        {page.intro.text.map((t, n) => <p key={n}>{t}</p>)}
      </PageIntro>

      <section className="section tone-light blogs" aria-label="Articles">
        <div className="shell blog-grid">
          {posts.length === 0 && <p>New articles are on the way.</p>}
          {posts.map((post, n) => (
            <article key={post.slug} className={`blog-card ${n === 0 ? 'blog-card--featured' : ''}`}>
              <Link href={`/blogs/${post.slug}`} className="blog-card-media" tabIndex={-1} aria-hidden="true">
                <Media image={{ src: post.imageSrc, alt: '' }} sizes={n === 0 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 33vw'} />
              </Link>
              <Reveal className="blog-card-copy">
                <Label as="span">{post.category ? `${post.category} · ` : ''}{readingMinutes(post)} min read</Label>
                <h2><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.excerpt}</p>
                <ArrowLink href={`/blogs/${post.slug}`}>{page.readLabel}</ArrowLink>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <ClosingCTA />
      <JsonLd data={breadcrumbs([['Blogs', '/blogs']])} />
    </>
  )
}
