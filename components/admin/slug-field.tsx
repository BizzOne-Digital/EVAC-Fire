'use client'

import { useEffect, useRef, useState } from 'react'
import { Field } from './form'

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

/** URL slug that follows the `source` field until the editor changes it by hand. */
export function SlugField({ value, source, hint }: { value: string; source: string; hint?: string }) {
  const [slug, setSlug] = useState(value)
  const manual = useRef(Boolean(value))
  useEffect(() => {
    const el = document.getElementById(`f-${source}`) as HTMLInputElement | null
    const on = () => !manual.current && setSlug(slugify(el?.value ?? ''))
    el?.addEventListener('input', on)
    return () => el?.removeEventListener('input', on)
  }, [source])
  return (
    <Field name="slug" label="URL slug" hint={hint} required>
      <input id="f-slug" name="slug" value={slug} required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={e => { manual.current = true; setSlug(slugify(e.target.value)) }} aria-describedby={hint ? 'f-slug-hint' : undefined} />
    </Field>
  )
}
