'use client'

import { createContext, useActionState, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from 'lucide-react'
import type { FieldErrors } from '@/lib/cms-schema'
import { MediaPicker, type PickedMedia } from './media-picker'
import { toast } from './toast'

export type FormState = { ok?: boolean; message?: string; errors?: FieldErrors }
type Action = (prev: FormState, fd: FormData) => Promise<FormState>

const Errors = createContext<FieldErrors>({})
const errorFor = (errors: FieldErrors, name: string) => errors[name] ?? Object.entries(errors).find(([k]) => k.startsWith(`${name}.`))?.[1]

export const MARKUP_HINT = 'One line per row. Wrap words in *asterisks* to highlight them in orange.'

/**
 * Admin form: posts to a server action without React's automatic form reset (so a failed
 * save keeps what was typed), shows field errors, toasts the result and guards unsaved changes.
 */
export function AdminForm({ action, children, submitLabel = 'Save changes', aside, resetOnSuccess }: { action: Action; children: ReactNode; submitLabel?: string; aside?: ReactNode; resetOnSuccess?: boolean }) {
  const [state, dispatch, pending] = useActionState(action, {})
  const [, start] = useTransition()
  const [dirty, setDirty] = useState(false)
  const alertRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) setDirty(false)
    if (state.ok && resetOnSuccess) formRef.current?.reset()
    if (state.message) toast(state.message, state.ok ? 'ok' : 'error')
    if (state.errors) alertRef.current?.focus()
  }, [state, resetOnSuccess])

  useEffect(() => {
    if (!dirty) return
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    // In-app links: ask before leaving with unsaved edits.
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href]')
      if (a && !a.closest('form') && !confirm('You have unsaved changes. Leave this page?')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    document.addEventListener('click', click, true)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
      document.removeEventListener('click', click, true)
    }
  }, [dirty])

  const errors = state.errors ?? {}
  const count = Object.keys(errors).length
  return (
    <Errors.Provider value={errors}>
      <form
        className="a-form"
        ref={formRef}
        onInput={() => setDirty(true)}
        onSubmit={e => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          start(() => dispatch(fd))
        }}
      >
        {count > 0 && (
          <div className="form-alert" role="alert" tabIndex={-1} ref={alertRef}>
            {count === 1 ? 'One field needs attention' : `${count} fields need attention`}: {Object.values(errors)[0]}
          </div>
        )}
        <div className="a-form-layout">
          <div className="a-form-main">{children}</div>
          {aside && <div className="a-form-aside">{aside}</div>}
        </div>
        <div className="a-savebar">
          <span className="a-savebar-state">{pending ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}</span>
          <button className="a-btn a-btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : submitLabel}</button>
        </div>
      </form>
    </Errors.Provider>
  )
}

export function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="a-card">
      <legend className="a-card-title">{title}</legend>
      {description && <p className="a-card-desc">{description}</p>}
      <div className="a-card-body">{children}</div>
    </fieldset>
  )
}

export function Field({ name, label, hint, required, children }: { name: string; label: string; hint?: string; required?: boolean; children: ReactNode }) {
  const error = errorFor(useContext(Errors), name)
  return (
    <div className={`field a-field ${error ? 'field--error' : ''}`}>
      <label htmlFor={`f-${name}`}>
        {label}
        {required ? <span className="a-req" aria-hidden="true"> *</span> : <span className="field-optional"> (optional)</span>}
      </label>
      {hint && <p className="field-hint" id={`f-${name}-hint`}>{hint}</p>}
      {children}
      {error && <p className="field-error" id={`f-${name}-error`}>{error}</p>}
    </div>
  )
}

const aria = (name: string, hint?: string) => ({ id: `f-${name}`, name, 'aria-describedby': hint ? `f-${name}-hint` : undefined })

type Base = { name: string; label: string; hint?: string; required?: boolean; max?: number }

export function Text({ value, type = 'text', placeholder, ...f }: Base & { value?: string | number | null; type?: string; placeholder?: string }) {
  return (
    <Field {...f}>
      <input {...aria(f.name, f.hint)} type={type} defaultValue={value ?? ''} required={f.required} maxLength={f.max} placeholder={placeholder} />
    </Field>
  )
}

export function Area({ value, rows = 4, ...f }: Base & { value?: string; rows?: number }) {
  return (
    <Field {...f}>
      <textarea {...aria(f.name, f.hint)} defaultValue={value ?? ''} rows={rows} required={f.required} maxLength={f.max} />
    </Field>
  )
}

/** One item per line, stored as a list. */
export function LinesField({ value, ...f }: Base & { value: string[]; rows?: number }) {
  return <Area {...f} value={value.join('\n')} rows={f.rows ?? Math.min(12, Math.max(3, value.length + 1))} hint={f.hint ?? 'One item per line.'} />
}

/** Paragraphs separated by a blank line. */
export function ParasField({ value, ...f }: Base & { value: string[]; rows?: number }) {
  return <Area {...f} value={value.join('\n\n')} rows={f.rows ?? 6} hint={f.hint ?? 'Separate paragraphs with a blank line.'} />
}

export function Select({ value, options, ...f }: Base & { value?: string; options: { value: string; label: string }[] }) {
  return (
    <Field {...f}>
      <select {...aria(f.name, f.hint)} defaultValue={value ?? ''} required={f.required}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  )
}

export function Toggle({ name, label, value, hint }: { name: string; label: string; value: boolean; hint?: string }) {
  return (
    <label className="a-toggle">
      <input type="checkbox" name={name} defaultChecked={value} role="switch" />
      <span className="a-toggle-track" aria-hidden="true" />
      <span>
        <span className="a-toggle-label">{label}</span>
        {hint && <span className="a-toggle-hint">{hint}</span>}
      </span>
    </label>
  )
}

/** Button label + destination pair. */
export function CtaFields({ name, label, value, required = true }: { name: string; label: string; value: { label: string; href: string }; required?: boolean }) {
  return (
    <div className="a-row">
      <Text name={`${name}.label`} label={`${label}: button text`} value={value.label} required={required} max={80} />
      <Text name={`${name}.href`} label={`${label}: link`} value={value.href} required={required} max={500} hint="A page like /contact#inquiry, or a full https:// link." />
    </div>
  )
}

/** Image chosen from the media library. Writes the URL (and optional alt text / size) into hidden or visible inputs. */
export function ImageField({ srcName, altName, src, alt, label, required = true, sizeNames, size }: { srcName: string; altName?: string; src: string; alt?: string; label: string; required?: boolean; sizeNames?: [string, string]; size?: [number, number] }) {
  const [value, setValue] = useState(src)
  const [dims, setDims] = useState(size)
  const [altValue, setAlt] = useState(alt ?? '')
  const [open, setOpen] = useState(false)
  const error = errorFor(useContext(Errors), srcName)
  const pick = (m: PickedMedia) => {
    setValue(m.url)
    if (m.width && m.height) setDims([m.width, m.height])
    if (altName && !altValue && m.alt) setAlt(m.alt)
    setOpen(false)
    // Hidden inputs don't fire input events; mark the form as changed.
    queueMicrotask(() => document.getElementById(`f-${srcName}`)?.dispatchEvent(new Event('input', { bubbles: true })))
  }
  return (
    <div className={`a-image ${error ? 'field--error' : ''}`}>
      <span className="a-image-label">
        {label}
        {required ? <span className="a-req" aria-hidden="true"> *</span> : <span className="field-optional"> (optional)</span>}
      </span>
      <div className="a-image-row">
        <div className="a-image-preview">{value ? <img src={value} alt="" /> : <ImageIcon aria-hidden="true" />}</div>
        <div className="a-image-actions">
          <input type="hidden" id={`f-${srcName}`} name={srcName} value={value} />
          {sizeNames && dims && (
            <>
              <input type="hidden" name={sizeNames[0]} value={dims[0]} />
              <input type="hidden" name={sizeNames[1]} value={dims[1]} />
            </>
          )}
          <span className="a-image-url">{value || 'No image selected'}</span>
          <div className="a-inline">
            <button type="button" className="a-btn" onClick={() => setOpen(true)}>{value ? 'Change image' : 'Choose image'}</button>
            {!required && value && <button type="button" className="a-btn a-btn--quiet" onClick={() => setValue('')}>Remove</button>}
          </div>
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
      {altName && (
        <div className="field a-field">
          <label htmlFor={`f-${altName}`}>Alt text <span className="field-optional">(describe the image; leave empty if decorative)</span></label>
          <input id={`f-${altName}`} name={altName} value={altValue} onChange={e => setAlt(e.target.value)} maxLength={300} />
        </div>
      )}
      {open && <MediaPicker onPick={pick} onClose={() => setOpen(false)} />}
    </div>
  )
}

/** Add / remove / reorder rows. Inputs are named `${name}.${index}.field`, re-indexed on every change. */
export function Repeater<T>({ name, items, blank, render, addLabel, max = 20, itemLabel }: { name: string; items: T[]; blank: T; render: (item: T, prefix: string, index: number) => ReactNode; addLabel: string; max?: number; itemLabel: (item: T, index: number) => string }) {
  const nextKey = useRef(items.length)
  const [rows, setRows] = useState(() => items.map((item, i) => ({ key: i, item })))
  const changed = () => queueMicrotask(() => document.getElementById(`rep-${name}`)?.dispatchEvent(new Event('input', { bubbles: true })))
  const move = (i: number, d: number) => {
    setRows(r => {
      const next = [...r]
      ;[next[i], next[i + d]] = [next[i + d], next[i]]
      return next
    })
    changed()
  }
  return (
    <div className="a-repeater" id={`rep-${name}`}>
      {rows.map((row, i) => (
        <div key={row.key} className="a-repeater-row">
          <div className="a-repeater-head">
            <span className="a-repeater-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="a-repeater-title">{itemLabel(row.item, i)}</span>
            <button type="button" className="a-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp /></button>
            <button type="button" className="a-icon-btn" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown /></button>
            <button type="button" className="a-icon-btn a-icon-btn--danger" onClick={() => { setRows(r => r.filter(x => x.key !== row.key)); changed() }} aria-label="Remove"><Trash2 /></button>
          </div>
          <div className="a-repeater-body">{render(row.item, `${name}.${i}`, i)}</div>
        </div>
      ))}
      {rows.length < max && (
        <button type="button" className="a-btn" onClick={() => { setRows(r => [...r, { key: nextKey.current++, item: blank }]); changed() }}>
          <Plus aria-hidden="true" /> {addLabel}
        </button>
      )}
    </div>
  )
}
