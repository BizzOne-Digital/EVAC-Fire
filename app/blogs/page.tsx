import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs } from '@/components/ui'
import { images, posts, readingMinutes } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Practical perspectives on fire safety plans, evacuation drills, fire warden roles, and staff training.',
  alternates: { canonical: '/blogs' },
}

export default function Blogs() {
  return (
    <>
      <PageIntro label="The EVAC journal" image={images.blogsIntro} lines={['Preparedness,', <em key="e">explained.</em>]}>
        <p>Practical perspectives on fire safety planning, evacuation preparedness, training, and the people who make it work.</p>
      </PageIntro>

      <section className="section tone-light blogs" aria-label="Articles">
        <div className="shell blog-grid">
          {posts.map((post, n) => (
            <article key={post.slug} className={`blog-card ${n === 0 ? 'blog-card--featured' : ''}`}>
              <Link href={`/blogs/${post.slug}`} className="blog-card-media" tabIndex={-1} aria-hidden="true">
                <Media image={{ ...post.image, alt: '' }} sizes={n === 0 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 33vw'} />
              </Link>
              <Reveal className="blog-card-copy">
                <Label as="span">{post.category} · {readingMinutes(post)} min read</Label>
                <h2><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.excerpt}</p>
                <ArrowLink href={`/blogs/${post.slug}`}>Read article</ArrowLink>
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
