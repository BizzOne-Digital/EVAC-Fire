'use client'

import { useState } from 'react'
import { savePost } from '@/app/admin/(panel)/blogs/actions'
import type { PostBlock } from '@/lib/db'
import { AdminForm, Area, Card, Field, ImageField, Repeater, Select, Text } from './form'
import { SlugField } from './slug-field'

export type PostValue = {
  title: string; slug: string; excerpt: string; body: PostBlock[]; imageSrc: string; imageAlt: string; category: string; tags: string[]
  author: string; serviceId: string | null; status: 'draft' | 'published'; publishedAt: string | null; seoTitle: string; seoDescription: string; ogImage: string
}

export const blankPost: PostValue = {
  title: '', slug: '', excerpt: '', body: [{ type: 'p', text: '' }], imageSrc: '', imageAlt: '', category: '', tags: [], author: '',
  serviceId: null, status: 'draft', publishedAt: null, seoTitle: '', seoDescription: '', ogImage: '',
}

const BLOCKS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h2', label: 'Heading' },
  { value: 'ul', label: 'Bullet list (one item per line)' },
]

// datetime-local has no time zone; convert in the browser so the server stores the moment the editor meant.
const toLocal = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() - new Date(iso).getTimezoneOffset() * 6e4).toISOString().slice(0, 16) : '')

function PublishDate({ value }: { value: string | null }) {
  const [local, setLocal] = useState(toLocal(value))
  return (
    <Field name="publishedAt" label="Publish date" hint="Leave empty to publish now. A future date schedules the post.">
      <input id="f-publishedAt" type="datetime-local" value={local} onChange={e => setLocal(e.target.value)} />
      <input type="hidden" name="publishedAt" value={local ? new Date(local).toISOString() : ''} />
    </Field>
  )
}

export function PostForm({ v, id, services, categories }: { v: PostValue; id: string | null; services: { value: string; label: string }[]; categories: string[] }) {
  return (
    <AdminForm
      action={savePost.bind(null, id)}
      submitLabel={id ? 'Save post' : 'Create post'}
      aside={
        <>
          <Card title="Publishing">
            <Select name="status" label="Status" value={v.status} required options={[{ value: 'draft', label: 'Draft (not on the website)' }, { value: 'published', label: 'Published' }]} />
            <input type="hidden" name="wasPublished" value={v.status === 'published' ? '1' : ''} />
            <PublishDate value={v.publishedAt} />
            <Text name="author" label="Author" value={v.author} max={120} hint="Leave empty to credit the company." />
          </Card>
          <Card title="Organize">
            <Field name="category" label="Category">
              <input id="f-category" name="category" defaultValue={v.category} maxLength={80} list="post-categories" />
              <datalist id="post-categories">{categories.map(c => <option key={c} value={c} />)}</datalist>
            </Field>
            <Text name="tags" label="Tags" value={v.tags.join(', ')} max={800} hint="Separate with commas." />
            <Select name="serviceId" label="Related service" value={v.serviceId ?? ''} options={[{ value: '', label: 'None' }, ...services]} hint="Shown beside the article with its call to action." />
          </Card>
        </>
      }
    >
      <Card title="Article">
        <Text name="title" label="Title" value={v.title} required max={200} />
        <SlugField value={v.slug} source="title" hint="The article URL: /blogs/slug." />
        <Area name="excerpt" label="Excerpt" value={v.excerpt} rows={2} required max={400} hint="Shown on the blog list and as the default search description." />
        <ImageField srcName="imageSrc" altName="imageAlt" src={v.imageSrc} alt={v.imageAlt} label="Featured image" />
      </Card>
      <Card title="Content" description="Build the article from paragraphs, headings and bullet lists. Use the arrows to reorder.">
        <Repeater
          name="body"
          items={v.body}
          blank={{ type: 'p', text: '' } as PostBlock}
          addLabel="Add block"
          max={200}
          itemLabel={b => `${BLOCKS.find(x => x.value === b.type)?.label.split(' (')[0]}${b.text ? ` · ${b.text.slice(0, 48)}${b.text.length > 48 ? '…' : ''}` : ''}`}
          render={(b, p) => (
            <>
              <Select name={`${p}.type`} label="Block type" value={b.type} required options={BLOCKS} />
              <Area name={`${p}.text`} label="Text" value={b.text} rows={b.type === 'h2' ? 1 : 4} required max={5000} />
            </>
          )}
        />
      </Card>
      <Card title="SEO" description="Optional. Falls back to the title, excerpt and featured image.">
        <Text name="seoTitle" label="SEO title" value={v.seoTitle} max={120} />
        <Area name="seoDescription" label="Meta description" value={v.seoDescription} rows={2} max={320} />
        <ImageField srcName="ogImage" src={v.ogImage} label="Social share image" required={false} />
      </Card>
    </AdminForm>
  )
}
