import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { contactHref, site } from '@/lib/site'
import type { Img } from '@/lib/content'

type Tone = 'light' | 'dark' | 'charcoal'
const vars = (v: Record<string, string | number>) => v as CSSProperties

export function Label({ children, as: Tag = 'p' }: { children: ReactNode; as?: 'p' | 'span' }) {
  return <Tag className="label">{children}</Tag>
}

/** Heading whose lines rise through a mask. `enter` plays on load (hero / page intro) instead of on scroll. */
export function Lines({ as: Tag = 'h2', lines, className, enter = false, id }: { as?: 'h1' | 'h2' | 'h3'; lines: ReactNode[]; className?: string; enter?: boolean; id?: string }) {
  return (
    <Tag id={id} className={`${className ?? ''} ${enter ? 'enter' : ''}`} data-reveal={enter ? undefined : 'mask'}>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span style={vars({ '--i': i })}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Reveal({ children, kind = 'up', delay = 0, className, as: Tag = 'div' }: { children: ReactNode; kind?: 'up' | 'clip' | 'stagger'; delay?: number; className?: string; as?: 'div' | 'section' | 'ul' | 'ol' | 'p' }) {
  // Clip the inner wrapper, not the observed element: a fully clipped target never reports as intersecting.
  return <Tag className={className} data-reveal={kind} style={delay ? vars({ '--d': delay }) : undefined}>{kind === 'clip' ? <span className="clip-inner">{children}</span> : children}</Tag>
}

export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'ghost' }) {
  return (
    <Link href={href} className={`btn ${variant === 'ghost' ? 'btn--ghost' : ''}`}>
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  )
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      <span>{children}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  )
}

/** Image with a clip reveal; `parallax` drifts it with scroll where scroll-driven animations are supported. */
export function Media({ image, sizes, className, priority = false, parallax = false }: { image: Img; sizes: string; className?: string; priority?: boolean; parallax?: boolean }) {
  return (
    <div className={`media ${parallax ? 'media--parallax' : ''} ${className ?? ''}`} data-reveal="image">
      <div className="media-pan">
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} />
      </div>
    </div>
  )
}

// Each word lights across a short slice of the statement's view timeline.
const range = (p: number) => `cover ${(12 + p * 32).toFixed(1)}% cover ${(20 + p * 32).toFixed(1)}%`

/** Large statement whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <p className={`scroll-words ${className ?? ''}`} data-reveal="up">
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} className="w" aria-hidden="true" style={vars({ '--range': range(i / Math.max(1, words.length - 1)) })}>{w}{' '}</span>
      ))}
    </p>
  )
}

export function Logo() {
  const { logo } = site
  return (
    <span className={logo.plate ? 'brand-plate' : 'brand-mark'}>
      <Image src={logo.src} alt={site.name} width={logo.width} height={logo.height} sizes="200px" priority />
    </span>
  )
}

export function PageIntro({ label, lines, children, image }: { label: string; lines: ReactNode[]; children?: ReactNode; image?: Img }) {
  return (
    <section className={`page-intro tone-dark ${image ? 'page-intro--image' : ''}`}>
      {image && (
        <div className="page-intro-media" aria-hidden="true">
          <Image src={image.src} alt="" fill priority sizes="100vw" />
        </div>
      )}
      <div className="page-intro-grid" aria-hidden="true" />
      <div className="shell">
        <div className="enter-fade" style={vars({ '--d': '.1s' })}><Label>{label}</Label></div>
        <Lines as="h1" lines={lines} enter />
        {children && <div className="page-intro-copy enter-fade" style={vars({ '--d': '.55s' })}>{children}</div>}
      </div>
    </section>
  )
}

export function Section({ tone = 'light', className, children, id, labelledBy }: { tone?: Tone; className?: string; children: ReactNode; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section tone-${tone} ${className ?? ''}`}>
      {children}
    </section>
  )
}

export function ClosingCTA() {
  return (
    <Section className="closing">
      <div className="shell closing-inner">
        <div>
          <Reveal><Label>Take the next step</Label></Reveal>
          <Lines lines={['Tell us about', <>your <em>building.</em></>]} />
        </div>
        <Reveal className="closing-copy" delay={150}>
          <p>Share your building type and what you need: a fire safety plan, a fire drill, fire safety training, or expert consultation. There is no public pricing. Contact us for pricing tailored to your building.</p>
          <div className="closing-actions">
            <ButtonLink href={contactHref()}>Contact for pricing</ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export const breadcrumbs = (items: [name: string, path: string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...items].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${site.url}${path}`,
  })),
})
