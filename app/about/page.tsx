import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { ClosingCTA, JsonLd, Label, Lines, Media, PageIntro, Reveal, ScrollWords, Section, breadcrumbs } from '@/components/ui'
import { about, approach, images } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'EVAC Fire & Safety makes fire safety simple and evacuation second nature: custom plans, supervised drills, hands-on training, and expert consultation.',
  alternates: { canonical: '/about' },
}

export default function About() {
  return (
    <>
      <PageIntro label={about.name} image={images.aboutIntro} lines={['We Make Fire Safety Simple', <>and Evacuation <em>Second Nature.</em></>]}>
        <p>{about.intro}</p>
        <p>{about.specialty}</p>
      </PageIntro>

      <Section className="why">
        <div className="shell why-grid">
          <div>
            <Reveal><Label>{about.whyLabel}</Label></Reveal>
            <ScrollWords text={about.why} className="why-quote" />
            <Reveal className="why-body" delay={150}>
              {about.whyBody.map((t, n) => <p key={n}>{t}</p>)}
              <p className="why-strong">{about.noShortcuts}</p>
            </Reveal>
          </div>
          <Media image={images.tower} sizes="(max-width: 900px) 100vw, 40vw" className="why-media" parallax />
        </div>
      </Section>

      <Section tone="charcoal" className="approach">
        <div className="shell">
          <Lines lines={['Our Approach']} />
          <Reveal as="ol" kind="stagger" className="approach-grid">
            {approach.map((a, n) => (
              <li key={a.title} style={{ '--i': n } as CSSProperties}>
                <span className="approach-num" aria-hidden="true">0{n + 1}</span>
                <h3>{a.title}</h3>
                {a.body.map(t => <p key={t}>{t}</p>)}
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section className="mission">
        <div className="shell">
          <Reveal as="p" className="mission-lead">{about.missionLead}</Reveal>
          <ScrollWords text={about.mission} className="mission-text" />
        </div>
      </Section>

      <ClosingCTA />
      <JsonLd data={breadcrumbs([['About Us', '/about']])} />
    </>
  )
}
