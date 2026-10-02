import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { PublicService } from '@/lib/cms'
import type { Doc } from '@/lib/cms-schema'
import type { ListItem } from '@/lib/db'
import { ArrowLink, ButtonLink, Label, Lines, Reveal, rich } from './ui'

const i = (n: number) => ({ '--i': n }) as CSSProperties

/** Home service index: full-row links. Hover and keyboard focus get the same treatment. */
export function ServiceIndex({ services }: { services: PublicService[] }) {
  return (
    <Reveal as="ol" kind="stagger" className="svc-index">
      {services.map((s, n) => (
        <li key={s.slug} style={i(n)}>
          <Link href={`/services#${s.slug}`} className="svc-row">
            <span className="svc-num" aria-hidden="true">{s.number}</span>
            <span className="svc-main">
              <span className="svc-title">{s.title}</span>
              <span className="svc-lead">{s.summary}</span>
            </span>
            <span className="svc-media" aria-hidden="true">
              <Image src={s.imageSrc} alt="" fill sizes="220px" />
            </span>
            <span className="svc-arrow" aria-hidden="true"><ArrowUpRight /></span>
          </Link>
        </li>
      ))}
    </Reveal>
  )
}

/** PLAN → PREPARE → PRACTICE, joined by a route line that draws as each stage enters view. */
export function ProcessRoute({ process }: { process: Doc<'home'>['process'] }) {
  const stages = process.stages.filter(s => s.enabled)
  return (
    <section className="section tone-charcoal process" aria-labelledby="process-title">
      <div className="shell">
        <div className="process-head">
          <Reveal><Label>{process.label}</Label></Reveal>
          <Lines id="process-title" lines={rich(process.title)} className="process-heading" />
          {process.subtitle && <Reveal as="p" className="process-sub" delay={250}>{process.subtitle}</Reveal>}
        </div>
        <ol className="route">
          {stages.map((stage, n) => (
            <li key={n} className="stage" data-reveal="stage" style={i(n)}>
              <span className="stage-node" aria-hidden="true" />
              <span className="stage-step" aria-hidden="true">Stage {String(n + 1).padStart(2, '0')}</span>
              <h3>{stage.step}</h3>
              <p>{stage.text}</p>
              <ArrowLink href={stage.cta.href}>{stage.cta.label}</ArrowLink>
            </li>
          ))}
        </ol>
        <div className="payoff">
          <span className="payoff-exit" data-reveal="up" aria-hidden="true">
            <ArrowUpRight />
          </span>
          <Lines lines={rich(process.payoff)} className="payoff-heading" />
          <Reveal delay={300}><ButtonLink href={process.payoffCta.href}>{process.payoffCta.label}</ButtonLink></Reveal>
        </div>
      </div>
    </section>
  )
}

export function AudienceIndex({ audiences }: { audiences: ListItem[] }) {
  return (
    <Reveal as="ul" kind="stagger" className="aud-grid">
      {audiences.map((group, n) => (
        <li key={String(group._id)} className="aud-group" style={i(n)}>
          <span className="aud-num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
          <h3>{group.title}</h3>
          <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </li>
      ))}
    </Reveal>
  )
}
