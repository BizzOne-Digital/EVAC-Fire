'use client'

import { useActionState, useEffect, useRef, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { submitInquiry } from '@/app/contact/actions'
import { PROPERTY_TYPES, SERVICE_OPTIONS, type InquiryField, type InquiryState } from '@/lib/inquiry'

const initial: InquiryState = { status: 'idle' }

export function InquiryForm({ defaultService, startedAt }: { defaultService: string; startedAt: number }) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={statusRef}>
        <span className="form-success-mark" aria-hidden="true" />
        <h2>Thank you. Your inquiry has been sent.</h2>
        <p>EVAC Fire &amp; Safety will follow up using the contact details you provided.</p>
      </div>
    )
  }

  const v = state.values ?? {}
  const err = state.errors ?? {}
  const field = (name: InquiryField) => ({
    id: `f-${name}`,
    name,
    defaultValue: v[name] ?? (name === 'service' ? defaultService : ''),
    'aria-invalid': err[name] ? true : undefined,
    'aria-describedby': [name === 'message' && 'f-message-hint', err[name] && `f-${name}-error`].filter(Boolean).join(' ') || undefined,
  })

  return (
    <form action={action} className="inquiry-form" key={JSON.stringify(v)}>
      {state.status === 'error' && (
        <div className="form-alert" role="alert" tabIndex={-1} ref={statusRef}>{state.message}</div>
      )}
      <div className="form-grid">
        <Field name="name" label="Name" error={err.name}>
          <input {...field('name')} required autoComplete="name" maxLength={100} />
        </Field>
        <Field name="organization" label="Company / organization" error={err.organization}>
          <input {...field('organization')} required autoComplete="organization" maxLength={150} />
        </Field>
        <Field name="email" label="Email" error={err.email}>
          <input {...field('email')} type="email" required autoComplete="email" maxLength={200} />
        </Field>
        <Field name="phone" label="Phone" optional error={err.phone}>
          <input {...field('phone')} type="tel" autoComplete="tel" maxLength={24} />
        </Field>
        <Field name="propertyType" label="Property / building type" error={err.propertyType}>
          <select {...field('propertyType')} required>
            <option value="" disabled>Select a building type</option>
            {PROPERTY_TYPES.map(g => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map(o => <option key={o} value={o}>{o}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field name="service" label="Service of interest" error={err.service}>
          <select {...field('service')} required>
            <option value="" disabled>Select a service</option>
            {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>
      <Field name="message" label="How can we help?" error={err.message} hint="Tell us about your building, number of occupants, or what you need help with.">
        <textarea {...field('message')} required rows={5} minLength={10} maxLength={3000} />
      </Field>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Leave this field empty</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          <span>{pending ? 'Sending…' : 'Send inquiry'}</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
        <p className="form-note">Contact for pricing.</p>
      </div>
    </form>
  )
}

function Field({ name, label, error, hint, optional, children }: { name: InquiryField; label: string; error?: string; hint?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={`f-${name}`}>
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {hint && <p className="field-hint" id={`f-${name}-hint`}>{hint}</p>}
      {children}
      {error && <p className="field-error" id={`f-${name}-error`}>{error}</p>}
    </div>
  )
}
