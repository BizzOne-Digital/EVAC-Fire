import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs } from '@/components/ui'
import { images, services, servicesIntro } from '@/lib/content'
import { contactHref, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Fire safety plans, supervised fire drills, fire safety training (online or in person), and expert consultation for buildings and organizations.',
  alternates: { canonical: '/services' },
}

const serviceLd = {
  '@context': 'https://schema.org',
  '@graph': services.map(s => ({
    '@type': 'Service',
    name: s.title,
    description: s.body[0],
    serviceType: s.title,
    url: `${site.url}/services#${s.slug}`,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
  })),
}

export default function Services() {
  return (
    <>
      <PageIntro label={servicesIntro.label} image={images.servicesIntro} lines={['Fire Safety.', 'Emergency Preparedness.', <em key="p">People Protected.</em>]}>
        {servicesIntro.body.map(t => <p key={t}>{t}</p>)}
      </PageIntro>

      <nav className="svc-jump tone-light" aria-label="Services on this page">
        <div className="shell svc-jump-inner">
          {services.map(s => (
            <Link key={s.slug} href={`#${s.slug}`}><span aria-hidden="true">{s.number}</span>{s.title}</Link>
          ))}
        </div>
      </nav>

      <div className="tone-light svc-details">
        {services.map(s => (
          <article key={s.slug} id={s.slug} className="svc-detail" aria-labelledby={`${s.slug}-title`}>
            <div className="shell svc-detail-grid">
              <div className="svc-detail-media">
                <Media image={s.image} sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div className="svc-detail-copy">
                <Reveal>
                  <Label>{s.number} / {s.title}{s.eyebrow ? ` ${s.eyebrow}` : ''}</Label>
                  <h2 id={`${s.slug}-title`}>{s.lead}</h2>
                  {s.body.map(t => <p key={t}>{t}</p>)}
                </Reveal>

                <Reveal delay={150}>
                  <h3 className="svc-list-title">{s.listTitle}</h3>
                  <ul className="svc-list">{s.list.map(item => <li key={item}>{item}</li>)}</ul>
                  {s.closing && <p className="svc-closing">{s.closing}</p>}
                </Reveal>

                <Reveal className="svc-cta" delay={200}>
                  <ButtonLink href={contactHref(s.slug)}>{s.cta}</ButtonLink>
                  <span>Contact for pricing.</span>
                </Reveal>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ClosingCTA />
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumbs([['Services', '/services']])} />
    </>
  )
}
