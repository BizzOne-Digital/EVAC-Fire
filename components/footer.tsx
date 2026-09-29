import Link from 'next/link'
import { services } from '@/lib/content'
import { contactHref, site } from '@/lib/site'
import { ButtonLink, Label, Lines, Logo, Reveal } from './ui'

export function Footer() {
  const { phone, email, address } = site.contact
  return (
    <footer className="site-footer tone-dark">
      <div className="shell footer-top">
        <div>
          <Reveal><Label>{site.name}</Label></Reveal>
          <Lines lines={['Ready when', <em key="m">it matters.</em>]} />
        </div>
        <Reveal delay={200}><ButtonLink href={contactHref()}>Start a conversation</ButtonLink></Reveal>
      </div>

      <Reveal className="shell footer-grid" kind="stagger">
        <div className="footer-brand" style={{ '--i': 0 } as React.CSSProperties}>
          <Link href="/" className="brand" aria-label={`${site.name} home`}><Logo /></Link>
          <p>Custom fire safety plans, supervised fire drills, hands-on fire safety training, and expert consultation.</p>
        </div>
        <nav aria-label="Footer" style={{ '--i': 1 } as React.CSSProperties}>
          <h2 className="footer-title">Explore</h2>
          <ul>{site.nav.map(i => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
        </nav>
        <div style={{ '--i': 2 } as React.CSSProperties}>
          <h2 className="footer-title">Services</h2>
          <ul>{services.map(s => <li key={s.slug}><Link href={contactHref(s.slug)}>{s.cta}</Link></li>)}</ul>
        </div>
        <div style={{ '--i': 3 } as React.CSSProperties}>
          <h2 className="footer-title">Contact</h2>
          <ul>
            {phone && <li><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></li>}
            {email && <li><a className="footer-email" href={`mailto:${email}`}>{email}</a></li>}
            {address && <li>{address}</li>}
            <li><Link href={contactHref()}>Send an inquiry</Link></li>
            <li className="footer-note">Contact for pricing.</li>
          </ul>
        </div>
      </Reveal>

      <div className="shell footer-meta">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.tagline}</span>
      </div>
    </footer>
  )
}
