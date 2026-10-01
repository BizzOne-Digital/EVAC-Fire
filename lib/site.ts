// Site-wide configuration. Replace values here when the client supplies them.

function resolveSiteUrl() {
  // The production domain is not confirmed yet: set NEXT_PUBLIC_SITE_URL at deploy time.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

export const site = {
  name: 'EVAC Fire & Safety',
  tagline: 'Plan. Prepare. Evacuate.',
  description:
    "EVAC Fire & Safety provides custom fire safety plans, supervised fire drills, hands-on fire safety training, and expert consultation — so when it's time to evacuate, everyone knows what to do.",
  url: resolveSiteUrl(),

  /**
   * Client logo. To swap in the final asset, change `src` (and the intrinsic size).
   * `plate: true` renders it on an ivory plate because this PNG has an opaque white
   * background. Set it to false for a transparent / reversed version.
   */
  logo: {
    src: '/logo/evac.png',
    width: 1170,
    height: 496,
    plate: true,
  },

  serviceAreas: ['Ottawa Region', 'Greater Toronto Area (GTA)'],

  // Contact details: pending from the client. Leave as null to hide them from the site.
  contact: {
    /** Each number is listed separately; letters dial via the phone keypad. */
    phones: ['613-262-FIRE', '613-262-3473'],
    email: 'info@evacfire.ca' as string | null,
    address: null as string | null,
  },

  nav: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/contact', label: 'Contact' },
  ],
}

export const contactHref = (service?: string) => (service ? `/contact?service=${service}#inquiry` : '/contact#inquiry')

const KEYPAD = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'] // keys 2–9
const keyFor = (c: string) => (/\d/.test(c) ? c : String(KEYPAD.findIndex(k => k.includes(c)) + 2))

/** tel: link for a North American number, mapping letters (613-262-FIRE) to keypad digits. */
export const telHref = (phone: string) => 'tel:+1' + [...phone.toLowerCase().replace(/[^a-z\d]/g, '')].map(keyFor).join('')
