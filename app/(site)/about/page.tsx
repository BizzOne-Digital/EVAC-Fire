import type { CSSProperties } from 'react'
import { ClosingCTA, JsonLd, Label, Lines, Media, PageIntro, Reveal, ScrollWords, Section, breadcrumbs, rich } from '@/components/ui'
import { getApproach, getDoc, pageMetadata } from '@/lib/cms'

export const generateMetadata = () => pageMetadata('about', '/about')

export default async function About() {
  const [about, approach] = await Promise.all([getDoc('about'), getApproach()])
  const { intro, why, mission } = about

  return (
    <>
      <PageIntro label={intro.label} image={intro.image} lines={rich(intro.title)}>
        {intro.text.map((t, n) => <p key={n}>{t}</p>)}
      </PageIntro>

      <Section className="why">
        <div className="shell why-grid">
          <div>
            <Reveal><Label>{why.label}</Label></Reveal>
            <ScrollWords text={why.quote} className="why-quote" />
            <Reveal className="why-body" delay={150}>
              {why.body.map((t, n) => <p key={n}>{t}</p>)}
              {why.strong && <p className="why-strong">{why.strong}</p>}
            </Reveal>
          </div>
          <Media image={why.image} sizes="(max-width: 900px) 100vw, 40vw" className="why-media" parallax />
        </div>
      </Section>

      {approach.length > 0 && (
        <Section tone="charcoal" className="approach">
          <div className="shell">
            <Lines lines={rich(about.approach.title)} />
            <Reveal as="ol" kind="stagger" className="approach-grid">
              {approach.map((a, n) => (
                <li key={String(a._id)} style={{ '--i': n } as CSSProperties}>
                  <span className="approach-num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  <h3>{a.title}</h3>
                  {a.items.map(t => <p key={t}>{t}</p>)}
                </li>
              ))}
            </Reveal>
          </div>
        </Section>
      )}

      <Section className="mission">
        <div className="shell">
          <Reveal as="p" className="mission-lead">{mission.lead}</Reveal>
          <ScrollWords text={mission.text} className="mission-text" />
        </div>
      </Section>

      <ClosingCTA />
      <JsonLd data={breadcrumbs([['About Us', '/about']])} />
    </>
  )
}
