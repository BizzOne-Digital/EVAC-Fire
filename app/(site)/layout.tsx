import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { RevealObserver } from '@/components/reveal-observer'
import { Splash } from '@/components/splash'
import { JsonLd } from '@/components/ui'
import { absolute, getDoc, getServices } from '@/lib/cms'
import { siteUrl, telHref } from '@/lib/site'

// Pages are cached and refreshed on every admin save; this hourly pass also publishes scheduled posts.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getDoc('settings'), getDoc('seo')])
  return {
    title: { default: seo.defaults.title, template: `%s | ${settings.name}` },
    description: seo.defaults.description,
    icons: [settings.favicon ? { url: settings.favicon } : { url: '/icon.svg', type: 'image/svg+xml' }],
    openGraph: { type: 'website', siteName: settings.name, locale: 'en_CA', images: [seo.defaults.ogImage || '/og'] },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, ctas, seo, services] = await Promise.all([getDoc('settings'), getDoc('ctas'), getDoc('seo'), getServices()])

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.name,
    url: siteUrl(),
    logo: absolute(settings.logo.src),
    slogan: settings.tagline,
    telephone: settings.phones.map(p => telHref(p).slice(4)),
    ...(settings.email && { email: settings.email }),
    ...(settings.address && { address: settings.address }),
    areaServed: settings.serviceAreas.map(name => ({ '@type': 'AdministrativeArea', name })),
    description: seo.defaults.description,
    knowsAbout: services.map(s => s.title),
    ...(settings.social.length && { sameAs: settings.social.map(s => s.href) }),
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Splash />
      <Header name={settings.name} tagline={settings.tagline} logo={settings.logo} nav={settings.nav} phones={settings.phones} cta={ctas.header} />
      <main id="main">{children}</main>
      <Footer />
      <RevealObserver />
      <JsonLd data={organization} />
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </>
  )
}
