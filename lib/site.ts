// Small pure helpers shared by the public site and the admin. Business details live in the CMS (Site Settings).

/** Absolute site origin. Set NEXT_PUBLIC_SITE_URL at deploy time once the production domain is confirmed. */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

export const contactHref = (service?: string) => (service ? `/contact?service=${service}#inquiry` : '/contact#inquiry')

const KEYPAD = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'] // keys 2–9
const keyFor = (c: string) => (/\d/.test(c) ? c : String(KEYPAD.findIndex(k => k.includes(c)) + 2))

/** tel: link for a North American number, mapping letters (613-262-FIRE) to keypad digits. */
export const telHref = (phone: string) => 'tel:+1' + [...phone.toLowerCase().replace(/[^a-z\d]/g, '')].map(keyFor).join('')

/** Splits CMS heading markup into lines (one per row) and `*highlighted*` segments. */
export function parseMarkup(text: string) {
  return text
    .split(/\r?\n/)
    .filter(l => l.trim())
    .map(line => line.split(/\*([^*]+)\*/).map((part, i) => ({ text: part, em: i % 2 === 1 })).filter(p => p.text))
}
