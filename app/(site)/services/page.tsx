import Link from 'next/link'
import { ButtonLink, ClosingCTA, JsonLd, Label, Media, PageIntro, Reveal, breadcrumbs, rich } from '@/components/ui'
import { getDoc, getServices, pageMetadata } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

export const generateMetadata = () => pageMetadata('services', '/services')

export default async function Services() {
  const [page, settings, services] = await Promise.all([getDoc('services'), getDoc('settings'), getServices()])
  const url = siteUrl()

  const serviceLd = {
    '@context': 'https://schema.org',
    '@graph': services.map(s => ({
      '@type': 'Service',
      name: s.title,
      description: s.body[0] ?? s.summary,
      serviceType: s.title,
      url: `${url}/services#${s.slug}`,
      provider: { '@type': 'Organization', name: settings.name, url },
    })),
  }

  return (
    <>
      <PageIntro label={page.intro.label} image={page.intro.image} lines={rich(page.intro.title)}>
        {page.intro.text.map((t, n) => <p key={n}>{t}</p>)}
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
                <Media image={{ src: s.imageSrc, alt: s.imageAlt }} sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div className="svc-detail-copy">
                <Reveal>
                  <Label>{s.number} / {s.title}{s.eyebrow ? ` ${s.eyebrow}` : ''}</Label>
                  <h2 id={`${s.slug}-title`}>{s.lead}</h2>
                  {s.body.map(t => <p key={t}>{t}</p>)}
                </Reveal>

                {s.list.length > 0 && (
                  <Reveal delay={150}>
                    {s.listTitle && <h3 className="svc-list-title">{s.listTitle}</h3>}
                    <ul className="svc-list">{s.list.map(item => <li key={item}>{item}</li>)}</ul>
                    {s.closing && <p className="svc-closing">{s.closing}</p>}
                  </Reveal>
                )}

                <Reveal className="svc-cta" delay={200}>
                  <ButtonLink href={s.href}>{s.ctaLabel}</ButtonLink>
                  {page.pricingNote && <span>{page.pricingNote}</span>}
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
