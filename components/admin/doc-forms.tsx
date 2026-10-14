'use client'

// Structured editors for the singleton CMS documents. Field names mirror the schema paths in lib/cms-schema.ts.
import { saveDoc } from '@/app/admin/(panel)/content-actions'
import type { Doc, DocKey } from '@/lib/cms-schema'
import { AdminForm, Area, Card, CtaFields, ImageField, LinesField, MARKUP_HINT, ParasField, Repeater, Text, Toggle } from './form'

const save = (key: DocKey) => saveDoc.bind(null, key)
type Img = { src: string; alt: string }

const Title = ({ name, value, label = 'Heading' }: { name: string; value: string; label?: string }) => (
  <Area name={name} label={label} value={value} rows={3} required max={300} hint={MARKUP_HINT} />
)
const Img = ({ name, value, label = 'Image' }: { name: string; value: Img; label?: string }) => (
  <ImageField srcName={`${name}.src`} altName={`${name}.alt`} src={value.src} alt={value.alt} label={label} />
)
const Section = ({ name, value }: { name: string; value: { enabled: boolean; label: string } }) => (
  <>
    <Toggle name={`${name}.enabled`} label="Show this section" value={value.enabled} />
    <Text name={`${name}.label`} label="Small label above the heading" value={value.label} required max={120} />
  </>
)
const Intro = ({ v }: { v: { label: string; title: string; text: string[]; image: Img } }) => (
  <Card title="Page intro" description="The dark banner at the top of the page.">
    <Text name="intro.label" label="Small label" value={v.label} required max={120} />
    <Title name="intro.title" value={v.title} />
    <ParasField name="intro.text" label="Intro text" value={v.text} />
    <Img name="intro.image" value={v.image} label="Background image" />
  </Card>
)

export function HomeForm({ v }: { v: Doc<'home'> }) {
  const { hero, area, intro, statement, services, process, audience, approach } = v
  return (
    <AdminForm action={save('home')}>
      <Card title="Hero" description="The first screen visitors see.">
        <Text name="hero.eyebrow" label="Eyebrow (small line above the headline)" value={hero.eyebrow} max={160} />
        <Title name="hero.title" value={hero.title} label="Main headline" />
        <Area name="hero.text" label="Supporting text" value={hero.text} max={600} />
        <CtaFields name="hero.primary" label="Primary button" value={hero.primary} />
        <CtaFields name="hero.secondary" label="Secondary button" value={hero.secondary} />
        <Img name="hero.image" value={hero.image} label="Background image" />
        <Text name="hero.position" label="Image focus point" value={hero.position} max={40} placeholder="center 35%" hint="Optional CSS position, e.g. “center 35%” or “left top”. Leave empty for the default." />
        <Toggle name="hero.showServiceIndex" label="Show the service links along the bottom of the hero" value={hero.showServiceIndex} />
      </Card>
      <Card title="Service area" description="The areas themselves are edited in Site settings.">
        <Section name="area" value={area} />
        <Text name="area.title" label="Heading" value={area.title} required max={300} hint="Wrap words in *asterisks* to highlight them." />
      </Card>
      <Card title="About introduction">
        <Section name="intro" value={intro} />
        <Title name="intro.title" value={intro.title} />
        <Area name="intro.lead" label="Lead paragraph (large)" value={intro.lead} max={1000} />
        <Area name="intro.text" label="Supporting paragraph" value={intro.text} max={1000} />
        <CtaFields name="intro.link" label="Link" value={intro.link} />
      </Card>
      <Card title="Why EVAC statement">
        <Section name="statement" value={statement} />
        <Area name="statement.title" label="Statement (lights up word by word)" value={statement.title} rows={2} required max={300} />
        <ParasField name="statement.notes" label="Supporting text" value={statement.notes} />
        <Text name="statement.strong" label="Closing line (bold)" value={statement.strong} max={200} />
      </Card>
      <Card title="Services section" description="Services are listed from the Services manager (those marked “Show on home page”).">
        <Section name="services" value={services} />
        <Title name="services.title" value={services.title} />
        <Area name="services.text" label="Description" value={services.text} max={1000} />
      </Card>
      <Card title="Plan / Prepare / Practice">
        <Section name="process" value={process} />
        <Title name="process.title" value={process.title} />
        <Text name="process.subtitle" label="Subheading" value={process.subtitle} max={300} />
        <Repeater
          name="process.stages"
          items={process.stages}
          blank={{ enabled: true, step: '', text: '', cta: { label: '', href: '/contact#inquiry' } }}
          addLabel="Add stage"
          max={8}
          itemLabel={s => s.step || 'New stage'}
          render={(s, p) => (
            <>
              <Toggle name={`${p}.enabled`} label="Show this stage" value={s.enabled} />
              <Text name={`${p}.step`} label="Stage title" value={s.step} required max={40} hint="Stages are numbered automatically in display order." />
              <Area name={`${p}.text`} label="Description" value={s.text} rows={2} required max={400} />
              <CtaFields name={`${p}.cta`} label="Link" value={s.cta} />
            </>
          )}
        />
        <Title name="process.payoff" value={process.payoff} label="Closing heading" />
        <CtaFields name="process.payoffCta" label="Closing button" value={process.payoffCta} />
      </Card>
      <Card title="Who we serve section" description="The groups are edited under Who we serve.">
        <Section name="audience" value={audience} />
        <Title name="audience.title" value={audience.title} />
        <Area name="audience.text" label="Description" value={audience.text} max={1000} />
      </Card>
      <Card title="Our approach section" description="The approach items are edited under Our approach.">
        <Section name="approach" value={approach} />
        <Title name="approach.title" value={approach.title} />
        <Img name="approach.image" value={approach.image} />
        <CtaFields name="approach.link" label="Link" value={approach.link} />
      </Card>
    </AdminForm>
  )
}

export function AboutForm({ v }: { v: Doc<'about'> }) {
  return (
    <AdminForm action={save('about')}>
      <Intro v={v.intro} />
      <Card title="Why section">
        <Text name="why.label" label="Small label" value={v.why.label} required max={120} />
        <Area name="why.quote" label="Statement (lights up word by word)" value={v.why.quote} rows={2} required max={300} />
        <ParasField name="why.body" label="Body text" value={v.why.body} rows={10} />
        <Text name="why.strong" label="Closing line (bold)" value={v.why.strong} max={200} />
        <Img name="why.image" value={v.why.image} />
      </Card>
      <Card title="Our approach" description="The items are edited under Our approach.">
        <Text name="approach.title" label="Heading" value={v.approach.title} required max={120} />
      </Card>
      <Card title="Mission">
        <Text name="mission.lead" label="Lead-in" value={v.mission.lead} required max={200} />
        <Area name="mission.text" label="Mission statement" value={v.mission.text} rows={2} required max={400} />
      </Card>
    </AdminForm>
  )
}

export function ServicesPageForm({ v }: { v: Doc<'services'> }) {
  return (
    <AdminForm action={save('services')}>
      <Intro v={v.intro} />
      <Card title="Service details">
        <Text name="pricingNote" label="Note beside each service button" value={v.pricingNote} max={200} />
      </Card>
    </AdminForm>
  )
}

export function BlogsPageForm({ v }: { v: Doc<'blogs'> }) {
  return (
    <AdminForm action={save('blogs')}>
      <Intro v={v.intro} />
      <Card title="Article cards">
        <Text name="readLabel" label="Link text on each card" value={v.readLabel} required max={60} />
      </Card>
    </AdminForm>
  )
}

export function ContactPageForm({ v }: { v: Doc<'contact'> }) {
  return (
    <AdminForm action={save('contact')}>
      <Intro v={v.intro} />
      <Card title="Beside the form" description="Phone numbers and email come from Site settings.">
        <Text name="aside.label" label="Small label" value={v.aside.label} required max={120} />
        <Text name="aside.title" label="Heading" value={v.aside.title} required max={120} />
        <Repeater
          name="aside.steps"
          items={v.aside.steps}
          blank={{ title: '', text: '' }}
          addLabel="Add step"
          max={6}
          itemLabel={s => s.title || 'New step'}
          render={(s, p) => (
            <>
              <Text name={`${p}.title`} label="Step title" value={s.title} required max={120} />
              <Area name={`${p}.text`} label="Step text" value={s.text} rows={2} required max={400} />
            </>
          )}
        />
      </Card>
      <Card title="Form">
        <Text name="formNote" label="Note beside the send button" value={v.formNote} max={200} />
        <Text name="success.title" label="Thank-you heading" value={v.success.title} required max={200} />
        <Area name="success.text" label="Thank-you text" value={v.success.text} rows={2} max={400} />
      </Card>
    </AdminForm>
  )
}

export function CtasForm({ v }: { v: Doc<'ctas'> }) {
  return (
    <AdminForm action={save('ctas')}>
      <Card title="Header button" description="Shown in the top navigation and the mobile menu.">
        <CtaFields name="header" label="Button" value={v.header} />
      </Card>
      <Card title="Closing call to action" description="The “Tell us about your building” block at the end of most pages.">
        <Toggle name="closing.enabled" label="Show this section" value={v.closing.enabled} />
        <Text name="closing.label" label="Small label" value={v.closing.label} required max={120} />
        <Title name="closing.title" value={v.closing.title} />
        <Area name="closing.text" label="Supporting text" value={v.closing.text} max={1000} />
        <CtaFields name="closing.cta" label="Button" value={v.closing.cta} />
      </Card>
      <Card title="Footer call to action">
        <Title name="footer.title" value={v.footer.title} />
        <CtaFields name="footer.cta" label="Button" value={v.footer.cta} />
      </Card>
    </AdminForm>
  )
}

export function SettingsForm({ v }: { v: Doc<'settings'> }) {
  return (
    <AdminForm action={save('settings')}>
      <Card title="Business">
        <Text name="name" label="Company name" value={v.name} required max={120} />
        <Text name="tagline" label="Tagline" value={v.tagline} required max={120} />
      </Card>
      <Card title="Brand">
        <ImageField srcName="logo.src" src={v.logo.src} label="Logo" sizeNames={['logo.width', 'logo.height']} size={[v.logo.width, v.logo.height]} />
        <Toggle name="logo.plate" label="Show the logo on a light plate" value={v.logo.plate} hint="Turn on for logos with a white background; off for transparent or light-on-dark logos." />
        <ImageField srcName="favicon" src={v.favicon} label="Favicon (browser tab icon)" required={false} />
      </Card>
      <Card title="Contact details" description="Used in the header, footer, contact page and search-engine data.">
        <LinesField name="phones" label="Phone numbers" value={v.phones} hint="One per line. Letters are fine, e.g. 613-262-FIRE." />
        <Text name="email" label="Email" type="email" value={v.email} max={200} />
        <Area name="address" label="Address" value={v.address} rows={2} max={300} hint="Leave empty to hide." />
        <LinesField name="serviceAreas" label="Service areas" value={v.serviceAreas} />
      </Card>
      <Card title="Navigation">
        <Repeater
          name="nav"
          items={v.nav}
          blank={{ label: '', href: '/' }}
          addLabel="Add menu item"
          max={10}
          itemLabel={n => n.label || 'New item'}
          render={(n, p) => (
            <div className="a-row">
              <Text name={`${p}.label`} label="Label" value={n.label} required max={40} />
              <Text name={`${p}.href`} label="Link" value={n.href} required max={500} />
            </div>
          )}
        />
      </Card>
      <Card title="Social media" description="Optional. Shown in the footer when added.">
        <Repeater
          name="social"
          items={v.social}
          blank={{ label: '', href: 'https://' }}
          addLabel="Add social link"
          max={10}
          itemLabel={n => n.label || 'New link'}
          render={(n, p) => (
            <div className="a-row">
              <Text name={`${p}.label`} label="Network" value={n.label} required max={40} placeholder="LinkedIn" />
              <Text name={`${p}.href`} label="Profile URL" value={n.href} required max={500} />
            </div>
          )}
        />
      </Card>
      <Card title="Footer">
        <Area name="footer.description" label="Short description under the logo" value={v.footer.description} rows={2} max={500} />
        <Text name="footer.note" label="Note under contact details" value={v.footer.note} max={200} />
        <Text name="footer.copyright" label="Copyright line" value={v.footer.copyright} max={200} hint="Leave empty for “© <current year> <company name>”." />
      </Card>
    </AdminForm>
  )
}

const PAGES = [['home', 'Home', '/'], ['about', 'About Us', '/about'], ['services', 'Services', '/services'], ['blogs', 'Blogs', '/blogs'], ['contact', 'Contact', '/contact']] as const

export function SeoForm({ v }: { v: Doc<'seo'> }) {
  return (
    <AdminForm action={save('seo')}>
      <Card title="Defaults" description="Used wherever a page has no SEO value of its own. The browser title of inner pages is “Page title | Company name”.">
        <Text name="defaults.title" label="Default title (home page)" value={v.defaults.title} required max={120} />
        <Area name="defaults.description" label="Default meta description" value={v.defaults.description} rows={3} required max={320} />
        <ImageField srcName="defaults.ogImage" src={v.defaults.ogImage} label="Default social share image" required={false} />
        <p className="a-muted">Without a share image, one is generated from the company name and the home headline.</p>
      </Card>
      {PAGES.map(([key, label, path]) => {
        const p = v.pages[key]
        return (
          <Card key={key} title={`${label} page`} description={`URL: ${path}`}>
            <Text name={`pages.${key}.title`} label="Page title" value={p.title} max={120} hint={key === 'home' ? 'Leave empty to use the default title.' : undefined} />
            <Area name={`pages.${key}.description`} label="Meta description" value={p.description} rows={2} max={320} hint="About 150–160 characters reads best in search results." />
            <ImageField srcName={`pages.${key}.ogImage`} src={p.ogImage} label="Social share image" required={false} />
            <Text name={`pages.${key}.canonical`} label="Canonical URL" value={p.canonical} max={500} placeholder={path} hint="Leave empty unless this page duplicates another URL." />
            <Toggle name={`pages.${key}.noindex`} label="Hide from search engines (noindex)" value={p.noindex} />
          </Card>
        )
      })}
    </AdminForm>
  )
}
