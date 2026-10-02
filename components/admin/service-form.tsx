'use client'

import { saveService } from '@/app/admin/(panel)/services/actions'
import { AdminForm, Area, Card, ImageField, LinesField, ParasField, Text, Toggle } from './form'
import { SlugField } from './slug-field'

export type ServiceValue = {
  title: string; slug: string; eyebrow: string; lead: string; summary: string; body: string[]; listTitle: string; list: string[]
  closing: string; ctaLabel: string; ctaHref: string; imageSrc: string; imageAlt: string; featured: boolean; published: boolean
}

export const blankService: ServiceValue = {
  title: '', slug: '', eyebrow: '', lead: '', summary: '', body: [], listTitle: '', list: [], closing: '',
  ctaLabel: 'Request a consultation', ctaHref: '', imageSrc: '', imageAlt: '', featured: true, published: false,
}

export function ServiceForm({ v, id }: { v: ServiceValue; id: string | null }) {
  return (
    <AdminForm
      action={saveService.bind(null, id)}
      submitLabel={id ? 'Save service' : 'Create service'}
      aside={
        <Card title="Visibility">
          <Toggle name="published" label="Published" value={v.published} hint="Hidden services disappear from every page and from the contact form." />
          <Toggle name="featured" label="Show on home page" value={v.featured} hint="Lists it in the home services section and the hero links." />
        </Card>
      }
    >
      <Card title="Service">
        <Text name="title" label="Title" value={v.title} required max={120} />
        <SlugField value={v.slug} source="title" hint="Used in links: /services#slug and /contact?service=slug. Changing it breaks old links." />
        <Text name="eyebrow" label="Label suffix" value={v.eyebrow} max={120} hint="Optional text after the title in the small label, e.g. “— Online or In-Person”." />
        <Area name="summary" label="Short description" value={v.summary} rows={2} required max={300} hint="Shown in the home page service list and on related blog posts." />
      </Card>
      <Card title="Services page content">
        <Text name="lead" label="Headline" value={v.lead} required max={200} />
        <ParasField name="body" label="Full description" value={v.body} />
        <Text name="listTitle" label="List heading" value={v.listTitle} max={120} placeholder="Our plans can address:" />
        <LinesField name="list" label="List items" value={v.list} rows={8} />
        <Area name="closing" label="Text after the list" value={v.closing} rows={2} max={1000} />
        <ImageField srcName="imageSrc" altName="imageAlt" src={v.imageSrc} alt={v.imageAlt} label="Image" />
      </Card>
      <Card title="Call to action">
        <Text name="ctaLabel" label="Button text" value={v.ctaLabel} required max={80} hint="Also used for this service in the footer." />
        <Text name="ctaHref" label="Button link" value={v.ctaHref} max={500} hint="Leave empty to open the contact form with this service preselected (recommended)." />
      </Card>
    </AdminForm>
  )
}
