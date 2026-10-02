// Shapes of the CMS documents and list items. Each schema both validates admin form input
// (strings from FormData) and describes what is stored. No framework imports: the seed uses it too.
import { z } from 'zod'

const s = (max = 300) => z.preprocess(v => (v == null ? '' : String(v)), z.string().trim().max(max, `Keep this under ${max} characters.`))
const req = (max = 300) => s(max).pipe(z.string().min(1, 'This field is required.'))
const bool = z.preprocess(v => v === true || v === 'on' || v === 'true', z.boolean())
const int = (min: number, max: number) => z.coerce.number().int().min(min).max(max)

const toList = (v: unknown, sep: RegExp) => (Array.isArray(v) ? v : String(v ?? '').split(sep)).map(x => String(x).trim()).filter(Boolean)
/** Textarea, one item per line. */
export const lines = (max = 500) => z.preprocess(v => toList(v, /\r?\n/), z.array(z.string().max(max)))
/** Textarea, paragraphs separated by a blank line. */
export const paras = (max = 2000) => z.preprocess(v => toList(v, /\r?\n\s*\r?\n/), z.array(z.string().max(max)))

// Links: site paths, anchors, web, mail and phone only. Blocks javascript: and data: URLs.
const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i
export const href = (required = true) =>
  (required ? req(500) : s(500)).refine(v => !v || SAFE_HREF.test(v), 'Use a site path like /contact, or a full https:// link.')
const SAFE_SRC = /^(\/(?!\/)|https:\/\/)/i
export const imageSrc = (required = true) =>
  (required ? req(500) : s(500)).refine(v => !v || SAFE_SRC.test(v), 'Choose an image from the media library.')

export const slug = req(80).refine(v => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), 'Use lowercase letters, numbers and hyphens, e.g. fire-drills.')

const image = z.object({ src: imageSrc(), alt: s(300) })
const cta = z.object({ label: req(80), href: href() })
const intro = z.object({ label: req(120), title: req(300), text: paras(), image })

export const settingsSchema = z.object({
  name: req(120),
  tagline: req(120),
  logo: z.object({ src: imageSrc(), width: int(1, 10000), height: int(1, 10000), plate: bool }),
  favicon: imageSrc(false),
  phones: lines(40),
  email: s(200).refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'Enter a valid email address.'),
  address: s(300),
  serviceAreas: lines(120),
  nav: z.array(z.object({ label: req(40), href: href() })).max(10),
  social: z.array(z.object({ label: req(40), href: href() })).max(10),
  footer: z.object({ description: s(500), note: s(200), copyright: s(200) }),
})

export const ctasSchema = z.object({
  header: cta,
  closing: z.object({ enabled: bool, label: req(120), title: req(200), text: s(1000), cta }),
  footer: z.object({ title: req(200), cta }),
})

const section = <T extends z.ZodRawShape>(shape: T) => z.object({ enabled: bool, label: req(120), title: req(300), ...shape })

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: s(160),
    title: req(200),
    text: s(600),
    primary: cta,
    secondary: cta,
    image,
    position: s(40),
    showServiceIndex: bool,
  }),
  area: section({}),
  intro: section({ lead: s(1000), text: s(1000), link: cta }),
  statement: section({ notes: paras(), strong: s(200) }),
  services: section({ text: s(1000) }),
  process: section({
    subtitle: s(300),
    stages: z.array(z.object({ enabled: bool, step: req(40), text: req(400), cta })).max(8),
    payoff: req(200),
    payoffCta: cta,
  }),
  audience: section({ text: s(1000) }),
  approach: section({ image, link: cta }),
})

export const aboutSchema = z.object({
  intro,
  why: z.object({ label: req(120), quote: req(300), body: paras(), strong: s(200), image }),
  approach: z.object({ title: req(120) }),
  mission: z.object({ lead: req(200), text: req(400) }),
})

export const servicesPageSchema = z.object({ intro, pricingNote: s(200) })
export const blogsPageSchema = z.object({ intro, readLabel: req(60) })
export const contactPageSchema = z.object({
  intro,
  aside: z.object({ label: req(120), title: req(120), steps: z.array(z.object({ title: req(120), text: req(400) })).max(6) }),
  formNote: s(200),
  success: z.object({ title: req(200), text: s(400) }),
})

export const PAGE_KEYS = ['home', 'about', 'services', 'blogs', 'contact'] as const
export type PageKey = (typeof PAGE_KEYS)[number]
const pageSeo = z.object({ title: s(120), description: s(320), ogImage: imageSrc(false), canonical: s(500), noindex: bool })
export const seoSchema = z.object({
  defaults: z.object({ title: req(120), description: req(320), ogImage: imageSrc(false) }),
  pages: z.object(Object.fromEntries(PAGE_KEYS.map(k => [k, pageSeo])) as Record<PageKey, typeof pageSeo>),
})

export const documents = {
  settings: settingsSchema,
  ctas: ctasSchema,
  home: homeSchema,
  about: aboutSchema,
  services: servicesPageSchema,
  blogs: blogsPageSchema,
  contact: contactPageSchema,
  seo: seoSchema,
}
export type DocKey = keyof typeof documents
export type Doc<K extends DocKey> = z.output<(typeof documents)[K]>

// ---- List content ---------------------------------------------------------------------------

export const serviceSchema = z.object({
  title: req(120),
  slug,
  eyebrow: s(120),
  lead: req(200),
  summary: req(300),
  body: paras(),
  listTitle: s(120),
  list: lines(300),
  closing: s(1000),
  ctaLabel: req(80),
  ctaHref: href(false),
  imageSrc: imageSrc(),
  imageAlt: s(300),
  featured: bool,
  published: bool,
})

const blockSchema = z.object({ type: z.enum(['p', 'h2', 'ul']), text: req(5000) })
export const postSchema = z.object({
  title: req(200),
  slug,
  excerpt: req(400),
  body: z.array(blockSchema).min(1, 'Add at least one paragraph.').max(200),
  imageSrc: imageSrc(),
  imageAlt: s(300),
  category: s(80),
  tags: z.preprocess(v => toList(v, /,/), z.array(z.string().max(40)).max(20)),
  author: s(120),
  serviceId: s(24).refine(v => !v || /^[a-f\d]{24}$/.test(v), 'Choose a service from the list.'),
  status: z.enum(['draft', 'published']),
  publishedAt: z.preprocess(v => (v ? new Date(String(v)) : null), z.date({ error: 'Enter a valid date.' }).nullable()),
  seoTitle: s(120),
  seoDescription: s(320),
  ogImage: imageSrc(false),
})

export const listItemSchema = z.object({ title: req(120), items: lines(500), published: bool })

// ---- Form helpers ---------------------------------------------------------------------------

/** FormData with dotted names (`hero.primary.label`, `stages.0.step`) to a nested object. */
export function formToObject(fd: FormData) {
  const root: Record<string, unknown> = {}
  for (const [name, value] of fd.entries()) {
    if (name.startsWith('$') || typeof value !== 'string') continue
    const path = name.split('.')
    let node: any = root
    path.forEach((key, i) => {
      if (i === path.length - 1) node[key] = value
      else node = node[key] ??= /^\d+$/.test(path[i + 1]) ? [] : {}
    })
  }
  return compact(root)
}
// Removed repeater rows leave holes in arrays.
const compact = (v: any): any =>
  Array.isArray(v) ? v.filter(x => x != null).map(compact) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, compact(x)])) : v

export type FieldErrors = Record<string, string>
export const fieldErrors = (e: z.ZodError): FieldErrors => Object.fromEntries(e.issues.map(i => [i.path.join('.'), i.message]).reverse())
