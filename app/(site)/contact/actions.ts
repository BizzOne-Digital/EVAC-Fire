'use server'

import { getServices } from '@/lib/cms'
import { collections } from '@/lib/db'
import { INQUIRY_FIELDS, serviceLabel, serviceOptions, validateInquiry, type InquiryState } from '@/lib/inquiry'
import { deliverLead, emailLead } from '@/lib/leads'

const MIN_FILL_MS = 2500

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const values = Object.fromEntries(INQUIRY_FIELDS.map(k => [k, String(formData.get(k) ?? '').trim()]))

  // Spam protection: hidden honeypot field and a minimum time on the form.
  if (String(formData.get('website') ?? '')) return { status: 'success' }
  const startedAt = Number(formData.get('startedAt'))
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'error', message: 'That was very quick. Please review your details and send again.', values }
  }

  const options = serviceOptions(await getServices())
  const { data, errors } = validateInquiry(values, options)
  if (!data) return { status: 'error', message: 'Please correct the highlighted fields and try again.', errors, values }

  const now = new Date()
  const lead = { ...data, serviceLabel: serviceLabel(data.service, options), source: 'website-contact-form' }
  try {
    await (await collections()).inquiries.insertOne({ ...lead, status: 'new', notes: '', createdAt: now, updatedAt: now } as never)
  } catch (err) {
    console.error('[inquiry] save failed:', err)
    return { status: 'error', message: "We couldn't send your inquiry right now. Please try again in a few minutes.", values }
  }

  // The inquiry is already stored; forwarding is best-effort.
  const full = { ...lead, submittedAt: now.toISOString() }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) console.warn('[smtp] skipped: SMTP_USER or SMTP_PASS not set')
  await Promise.all([
    process.env.LEAD_WEBHOOK_URL && deliverLead(full).catch(err => console.error('[inquiry] webhook failed:', err)),
    process.env.SMTP_USER && process.env.SMTP_PASS && emailLead(full).catch(err => console.error('[inquiry] email failed:', err)),
  ])
  return { status: 'success' }
}
