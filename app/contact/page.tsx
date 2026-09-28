import type { Metadata } from 'next'
import { InquiryForm } from '@/components/inquiry-form'
import { JsonLd, Label, PageIntro, Reveal, breadcrumbs } from '@/components/ui'
import { images } from '@/lib/content'
import { serviceFromParam } from '@/lib/inquiry'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Request a fire safety plan, schedule a fire drill, book fire safety training, or ask about expert consultation. Contact EVAC Fire & Safety for pricing.',
  alternates: { canonical: '/contact' },
}

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const { service } = await searchParams
  const { phone, email, address } = site.contact
  const hasDetails = Boolean(phone || email || address)

  return (
    <>
      <PageIntro label="Contact" image={images.contactIntro} lines={["Let's make your", <>next step <em>clear.</em></>]}>
        <p>Tell us about your building, your team, or what you need help with, and we will help clarify the right next step.</p>
      </PageIntro>

      <section className="section tone-light contact" id="inquiry" aria-labelledby="inquiry-title">
        <div className="shell contact-grid">
          <Reveal className="contact-aside">
            <Label>Start a conversation</Label>
            <h2 id="inquiry-title">Send an inquiry</h2>
            <ol className="contact-steps">
              <li><strong>Tell us about your building</strong>Building type, occupants, and the service you are interested in.</li>
              <li><strong>We follow up</strong>We will contact you to clarify what your building needs.</li>
              <li><strong>Contact for pricing</strong>There is no public pricing. Pricing is provided for your specific building and scope.</li>
            </ol>
            {hasDetails && (
              <dl className="contact-details">
                {phone && <><dt>Phone</dt><dd><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></dd></>}
                {email && <><dt>Email</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></>}
                {address && <><dt>Office</dt><dd>{address}</dd></>}
              </dl>
            )}
          </Reveal>
          <InquiryForm defaultService={serviceFromParam(service)} startedAt={Date.now()} />
        </div>
      </section>
      <JsonLd data={breadcrumbs([['Contact', '/contact']])} />
    </>
  )
}
