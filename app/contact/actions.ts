'use server'

import { INQUIRY_FIELDS, serviceLabel, validateInquiry, type InquiryState } from '@/lib/inquiry'
import { deliverLead } from '@/lib/leads'

const MIN_FILL_MS = 2500

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const values = Object.fromEntries(INQUIRY_FIELDS.map(k => [k, String(formData.get(k) ?? '').trim()]))

  // Spam protection: hidden honeypot field and a minimum time on the form.
  if (String(formData.get('website') ?? '')) return { status: 'success' }
  const startedAt = Number(formData.get('startedAt'))
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'error', message: 'That was very quick. Please review your details and send again.', values }
  }

  const { data, errors } = validateInquiry(values)
  if (!data) return { status: 'error', message: 'Please correct the highlighted fields and try again.', errors, values }

  try {
    await deliverLead({ ...data, serviceLabel: serviceLabel(data.service), submittedAt: new Date().toISOString(), source: 'website-contact-form' })
  } catch (err) {
    console.error('[inquiry] delivery failed:', err)
    return { status: 'error', message: "We couldn't send your inquiry right now. Please try again in a few minutes.", values }
  }
  return { status: 'success' }
}
