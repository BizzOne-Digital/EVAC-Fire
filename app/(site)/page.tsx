import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { MapPin } from 'lucide-react'
import { AudienceIndex, ProcessRoute, ServiceIndex } from '@/components/sections'
import { ArrowLink, ButtonLink, ClosingCTA, Label, Lines, Media, Reveal, ScrollWords, Section, inline, rich } from '@/components/ui'
import { getApproach, getAudiences, getDoc, getServices, pageMetadata } from '@/lib/cms'

const d = (s: string) => ({ '--d': s }) as CSSProperties

export const generateMetadata = () => pageMetadata('home', '/')

export default async function Home() {
  const [home, settings, allServices, audiences, approach] = await Promise.all([getDoc('home'), getDoc('settings'), getServices(), getAudiences(), getApproach()])
  const { hero, area, intro, statement, services: svc, process, audience } = home
  const featured = allServices.filter(s => s.featured)

  return (
    <>
      <section className="hero tone-dark" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <Image src={hero.image.src} alt="" fill priority sizes="100vw" style={hero.position ? { objectPosition: hero.position } : undefined} />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-content">
          {hero.eyebrow && <div className="enter-fade" style={d('.05s')}><Label>{hero.eyebrow}</Label></div>}
          <Lines as="h1" id="hero-title" enter className="hero-title" lines={rich(hero.title)} />
          {hero.text && <p className="hero-copy enter-fade" style={d('.55s')}>{hero.text}</p>}
          <div className="hero-actions enter-fade" style={d('.7s')}>
            <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="ghost">{hero.secondary.label}</ButtonLink>
          </div>
        </div>
        {hero.showServiceIndex && (
          <nav className="shell hero-index enter-fade" style={d('.9s')} aria-label="Services">
            {featured.map(s => (
              <Link key={s.slug} href={`/services#${s.slug}`}>
                <span aria-hidden="true">{s.number}</span>
                {s.title}
              </Link>
            ))}
          </nav>
        )}
      </section>

      {area.enabled && (
        <section className="service-area tone-charcoal" aria-labelledby="area-title">
          <div className="shell area-inner">
            <Reveal>
              <Label>{area.label}</Label>
              <h2 id="area-title" className="area-title">{inline(area.title)}</h2>
            </Reveal>
            <Reveal as="ul" kind="stagger" className="area-list">
              {settings.serviceAreas.map((name, n) => (
                <li key={name} style={{ '--i': n } as CSSProperties}>
                  <MapPin aria-hidden="true" />
                  {name}
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {intro.enabled && (
        <Section className="intro">
          <div className="shell intro-grid">
            <div>
              <Reveal><Label>{intro.label}</Label></Reveal>
              <Lines lines={rich(intro.title)} />
            </div>
            <Reveal className="intro-body" delay={150}>
              {intro.lead && <p className="lede">{intro.lead}</p>}
              {intro.text && <p>{intro.text}</p>}
              <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
            </Reveal>
          </div>
        </Section>
      )}

      {statement.enabled && (
        <Section tone="dark" className="statement">
          <div className="shell">
            <Reveal><Label>{statement.label}</Label></Reveal>
            <ScrollWords text={statement.title} className="statement-quote" />
            <Reveal className="statement-notes" kind="stagger">
              {statement.notes.map((t, n) => <p key={n} style={{ '--i': n } as CSSProperties}>{t}</p>)}
              {statement.strong && <p className="statement-strong" style={{ '--i': statement.notes.length } as CSSProperties}>{statement.strong}</p>}
            </Reveal>
          </div>
        </Section>
      )}

      {svc.enabled && featured.length > 0 && (
        <Section className="services-home">
          <div className="shell">
            <div className="section-head">
              <div>
                <Reveal><Label>{svc.label}</Label></Reveal>
                <Lines lines={rich(svc.title)} />
              </div>
              {svc.text && <Reveal as="p" delay={200}>{svc.text}</Reveal>}
            </div>
            <ServiceIndex services={featured} />
          </div>
        </Section>
      )}

      {process.enabled && <ProcessRoute process={process} />}

      {audience.enabled && audiences.length > 0 && (
        <Section className="audience">
          <div className="shell">
            <div className="section-head">
              <div>
                <Reveal><Label>{audience.label}</Label></Reveal>
                <Lines lines={rich(audience.title)} />
              </div>
              {audience.text && <Reveal as="p" delay={200}>{audience.text}</Reveal>}
            </div>
            <AudienceIndex audiences={audiences} />
          </div>
        </Section>
      )}

      {home.approach.enabled && approach.length > 0 && (
        <section className="split tone-dark" aria-labelledby="approach-title">
          <Media image={home.approach.image} sizes="(max-width: 900px) 100vw, 50vw" className="split-media" parallax />
          <div className="split-copy">
            <Reveal><Label>{home.approach.label}</Label></Reveal>
            <Lines id="approach-title" lines={rich(home.approach.title)} />
            <Reveal as="ol" kind="stagger" className="approach-list">
              {approach.map((a, n) => (
                <li key={String(a._id)} style={{ '--i': n } as CSSProperties}>
                  <h3>{a.title}</h3>
                  {a.items.map(t => <p key={t}>{t}</p>)}
                </li>
              ))}
            </Reveal>
            <Reveal delay={200}><ArrowLink href={home.approach.link.href}>{home.approach.link.label}</ArrowLink></Reveal>
          </div>
        </section>
      )}

      <ClosingCTA />
    </>
  )
}
