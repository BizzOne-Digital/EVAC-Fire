import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { AudienceIndex, ProcessRoute, ServiceIndex } from '@/components/sections'
import { ArrowLink, ButtonLink, ClosingCTA, Label, Lines, Media, Reveal, ScrollWords, Section } from '@/components/ui'
import { about, approach, images, services, servicesIntro } from '@/lib/content'
import { contactHref, site } from '@/lib/site'

const d = (s: string) => ({ '--d': s }) as CSSProperties

export const metadata = { alternates: { canonical: '/' } }

export default function Home() {
  return (
    <>
      <section className="hero tone-dark" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <Image src={images.hero.src} alt="" fill priority sizes="100vw" />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-content">
          <div className="enter-fade" style={d('.05s')}><Label>Fire safety plans · Drills · Training · Consultation</Label></div>
          <Lines as="h1" enter className="hero-title" lines={['PLAN.', <em key="p">PREPARE.</em>, 'EVACUATE.']} />
          <p className="hero-copy enter-fade" style={d('.55s')}>{site.description}</p>
          <div className="hero-actions enter-fade" style={d('.7s')}>
            <ButtonLink href={contactHref('fire-safety-plan')}>Request a fire safety plan</ButtonLink>
            <ButtonLink href="/services" variant="ghost">Explore our services</ButtonLink>
          </div>
        </div>
        <nav className="shell hero-index enter-fade" style={d('.9s')} aria-label="Services">
          {services.map(s => (
            <Link key={s.slug} href={`/services#${s.slug}`}>
              <span aria-hidden="true">{s.number}</span>
              {s.title}
            </Link>
          ))}
        </nav>
      </section>

      <Section className="intro">
        <div className="shell intro-grid">
          <div>
            <Reveal><Label>About EVAC Fire &amp; Safety</Label></Reveal>
            <Lines lines={['We Make Fire Safety Simple', <>and Evacuation <em>Second Nature.</em></>]} />
          </div>
          <Reveal className="intro-body" delay={150}>
            <p className="lede">{about.intro}</p>
            <p>{about.specialty}</p>
            <ArrowLink href="/about">About EVAC</ArrowLink>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" className="statement">
        <div className="shell">
          <Reveal><Label>{about.whyLabel}</Label></Reveal>
          <ScrollWords text={about.why} className="statement-quote" />
          <Reveal className="statement-notes" kind="stagger">
            {about.whyBody.map((t, n) => <p key={n} style={{ '--i': n } as CSSProperties}>{t}</p>)}
            <p className="statement-strong" style={{ '--i': 2 } as CSSProperties}>{about.noShortcuts}</p>
          </Reveal>
        </div>
      </Section>

      <Section className="services-home">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><Label>{servicesIntro.label}</Label></Reveal>
              <Lines lines={['Fire Safety.', 'Emergency Preparedness.', <em key="p">People Protected.</em>]} />
            </div>
            <Reveal as="p" delay={200}>{servicesIntro.body[1]}</Reveal>
          </div>
          <ServiceIndex />
        </div>
      </Section>

      <ProcessRoute />

      <Section className="audience">
        <div className="shell">
          <div className="section-head">
            <div>
              <Reveal><Label>Who we serve</Label></Reveal>
              <Lines lines={['Built for the people', <>responsible for <em>people.</em></>]} />
            </div>
            <Reveal as="p" delay={200}>From a single storefront to a portfolio of buildings, EVAC helps the people accountable for occupant safety plan, prepare, and practice.</Reveal>
          </div>
          <AudienceIndex />
        </div>
      </Section>

      <section className="split tone-dark" aria-labelledby="approach-title">
        <Media image={images.stair} sizes="(max-width: 900px) 100vw, 50vw" className="split-media" parallax />
        <div className="split-copy">
          <Reveal><Label>How we work</Label></Reveal>
          <Lines id="approach-title" lines={['Our Approach']} />
          <Reveal as="ol" kind="stagger" className="approach-list">
            {approach.map((a, n) => (
              <li key={a.title} style={{ '--i': n } as CSSProperties}>
                <h3>{a.title}</h3>
                {a.body.map(t => <p key={t}>{t}</p>)}
              </li>
            ))}
          </Reveal>
          <Reveal delay={200}><ArrowLink href="/about">How we work</ArrowLink></Reveal>
        </div>
      </section>

      <ClosingCTA />
    </>
  )
}
