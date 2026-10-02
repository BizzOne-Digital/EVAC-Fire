import { ArrowUpRight } from 'lucide-react'
import { InquiryForm } from '@/components/inquiry-form'
import { JsonLd, Label, PageIntro, Reveal, breadcrumbs, rich } from '@/components/ui'
import { getDoc, getServices, pageMetadata } from '@/lib/cms'
import { serviceFromParam, serviceOptions } from '@/lib/inquiry'
import { telHref } from '@/lib/site'

export const generateMetadata = () => pageMetadata('contact', '/contact')

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const [{ service }, page, settings, services] = await Promise.all([searchParams, getDoc('contact'), getDoc('settings'), getServices()])
  const { phones, email, address } = settings
  const options = serviceOptions(services)

  return (
    <>
      <PageIntro label={page.intro.label} image={page.intro.image} lines={rich(page.intro.title)}>
        {page.intro.text.map((t, n) => <p key={n}>{t}</p>)}
      </PageIntro>

      <section className="section tone-light contact" id="inquiry" aria-labelledby="inquiry-title">
        <div className="shell contact-grid">
          <Reveal className="contact-aside">
            <Label>{page.aside.label}</Label>
            <h2 id="inquiry-title">{page.aside.title}</h2>
            <ol className="contact-steps">
              {page.aside.steps.map(s => <li key={s.title}><strong>{s.title}</strong>{s.text}</li>)}
            </ol>
            {phones.map((p, i) => (
              <a key={p} className="contact-email" href={telHref(p)}>
                <span className="contact-email-label">{i === 0 ? 'Call us' : 'Or call'}</span>
                <span className="contact-email-address">
                  {p}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </a>
            ))}
            {email && (
              <a className="contact-email" href={`mailto:${email}`}>
                <span className="contact-email-label">Email us directly</span>
                <span className="contact-email-address">
                  {email}
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </a>
            )}
            {address && (
              <dl className="contact-details">
                <dt>Office</dt><dd>{address}</dd>
              </dl>
            )}
          </Reveal>
          <InquiryForm options={options} defaultService={serviceFromParam(service, options)} startedAt={Date.now()} note={page.formNote} success={page.success} />
        </div>
      </section>
      <JsonLd data={breadcrumbs([['Contact', '/contact']])} />
    </>
  )
}
