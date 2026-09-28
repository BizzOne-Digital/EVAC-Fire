import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { audiences, processSection, services } from '@/lib/content'
import { contactHref } from '@/lib/site'
import { ArrowLink, ButtonLink, Label, Lines, Reveal } from './ui'

const i = (n: number) => ({ '--i': n }) as CSSProperties

/** Home service index: full-row links. Hover and keyboard focus get the same treatment. */
export function ServiceIndex() {
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
              <Image src={s.image.src} alt="" fill sizes="220px" />
            </span>
            <span className="svc-arrow" aria-hidden="true"><ArrowUpRight /></span>
          </Link>
        </li>
      ))}
    </Reveal>
  )
}

/** PLAN → PREPARE → PRACTICE, joined by a route line that draws as each stage enters view. */
export function ProcessRoute() {
  return (
    <section className="section tone-charcoal process" aria-labelledby="process-title">
      <div className="shell">
        <div className="process-head">
          <Reveal><Label>Plan / Prepare / Practice</Label></Reveal>
          <Lines id="process-title" lines={[processSection.title[0], <em key="o">{processSection.title[1]}</em>]} className="process-heading" />
          <Reveal as="p" className="process-sub" delay={250}>{processSection.heading}</Reveal>
        </div>
        <ol className="route">
          {processSection.stages.map((stage, n) => {
            const svc = services.find(s => s.slug === stage.service)!
            return (
              <li key={stage.step} className="stage" data-reveal="stage" style={i(n)}>
                <span className="stage-node" aria-hidden="true" />
                <span className="stage-step" aria-hidden="true">Stage 0{n + 1}</span>
                <h3>{stage.step}</h3>
                <p>{stage.text}</p>
                <ArrowLink href={contactHref(svc.slug)}>{svc.cta}</ArrowLink>
              </li>
            )
          })}
        </ol>
        <div className="payoff">
          <span className="payoff-exit" data-reveal="up" aria-hidden="true">
            <ArrowUpRight />
          </span>
          <Lines lines={[processSection.payoff[0], <em key="r">{processSection.payoff[1]}</em>]} className="payoff-heading" />
          <Reveal delay={300}><ButtonLink href={contactHref()}>Request a consultation</ButtonLink></Reveal>
        </div>
      </div>
    </section>
  )
}

export function AudienceIndex() {
  return (
    <Reveal as="ul" kind="stagger" className="aud-grid">
      {audiences.map((group, n) => (
        <li key={group.title} className="aud-group" style={i(n)}>
          <span className="aud-num" aria-hidden="true">0{n + 1}</span>
          <h3>{group.title}</h3>
          <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </li>
      ))}
    </Reveal>
  )
}
