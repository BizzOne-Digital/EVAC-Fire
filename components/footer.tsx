import Link from 'next/link'
import { getDoc, getServices } from '@/lib/cms'
import { contactHref, telHref } from '@/lib/site'
import { Logo } from './logo'
import { ButtonLink, Label, Lines, Reveal, rich } from './ui'

export async function Footer() {
  const [settings, ctas, services] = await Promise.all([getDoc('settings'), getDoc('ctas'), getServices()])
  const { name, phones, email, address, footer, social } = settings
  return (
    <footer className="site-footer tone-dark">
      <div className="shell footer-top">
        <div>
          <Reveal><Label>{name}</Label></Reveal>
          <Lines lines={rich(ctas.footer.title)} />
        </div>
        <Reveal delay={200}><ButtonLink href={ctas.footer.cta.href}>{ctas.footer.cta.label}</ButtonLink></Reveal>
      </div>

      <Reveal className="shell footer-grid" kind="stagger">
        <div className="footer-brand" style={{ '--i': 0 } as React.CSSProperties}>
          <Link href="/" className="brand" aria-label={`${name} home`}><Logo logo={settings.logo} name={name} /></Link>
          {footer.description && <p>{footer.description}</p>}
        </div>
        <nav aria-label="Footer" style={{ '--i': 1 } as React.CSSProperties}>
          <h2 className="footer-title">Explore</h2>
          <ul>{settings.nav.map(i => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
        </nav>
        <div style={{ '--i': 2 } as React.CSSProperties}>
          <h2 className="footer-title">Services</h2>
          <ul>{services.map(s => <li key={s.slug}><Link href={s.href}>{s.ctaLabel}</Link></li>)}</ul>
        </div>
        <div style={{ '--i': 3 } as React.CSSProperties}>
          <h2 className="footer-title">Contact</h2>
          <ul>
            {phones.map(p => <li key={p}><a className="footer-email" href={telHref(p)}>{p}</a></li>)}
            {email && <li><a className="footer-email" href={`mailto:${email}`}>{email}</a></li>}
            {address && <li>{address}</li>}
            <li><Link href={contactHref()}>Send an inquiry</Link></li>
            {social.map(s => <li key={s.href}><a href={s.href} rel="noopener" target="_blank">{s.label}</a></li>)}
            {footer.note && <li className="footer-note">{footer.note}</li>}
          </ul>
        </div>
      </Reveal>

      <div className="shell footer-meta">
        <span>{footer.copyright || `© ${new Date().getFullYear()} ${name}`}</span>
        <span>{settings.tagline}</span>
      </div>
    </footer>
  )
}
