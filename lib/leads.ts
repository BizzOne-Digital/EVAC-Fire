import 'server-only'
import nodemailer from 'nodemailer'
import type { InquiryData } from './inquiry'

export type Lead = InquiryData & { serviceLabel: string; submittedAt: string; source: string }

/** Optional copy of each new inquiry to LEAD_WEBHOOK_URL (Zapier / Make / HubSpot / CRM / email relay). */
export async function deliverLead(lead: Lead) {
  const res = await fetch(process.env.LEAD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lead),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`)
}

/**
 * Emails each new inquiry through Gmail SMTP (smtp.gmail.com:465, SSL) when SMTP_USER and SMTP_PASS are set. Server-only.
 * SMTP_USER is the Gmail / Google Workspace address; SMTP_PASS is a 16-character App Password
 * (Google Account > Security > 2-Step Verification > App passwords), not the normal account password.
 */
export async function emailLead(lead: Lead) {
  const { LEAD_EMAIL_TO } = process.env
  const SMTP_USER = process.env.SMTP_USER!.trim()
  const SMTP_PASS = process.env.SMTP_PASS!.replace(/\s+/g, '') // Google shows app passwords in groups of four
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: SMTP_USER, pass: SMTP_PASS } })
  const rows: [string, string][] = [
    ['Name', lead.name], ['Organization', lead.organization], ['Email', lead.email], ['Phone', lead.phone],
    ['Property type', lead.propertyType], ['Service', lead.serviceLabel], ['Message', lead.message], ['Submitted', lead.submittedAt],
  ]
  const to = LEAD_EMAIL_TO || SMTP_USER
  const t0 = Date.now()
  console.log(`[smtp] sending inquiry from ${lead.email} to ${to} via Gmail as ${SMTP_USER}`)
  try {
    await transport.verify() // throws with Gmail's reason on a bad login
    console.log(`[smtp] connected to Gmail (${Date.now() - t0} ms)`)
    const info = await transport.sendMail({
      from: `"Website Inquiry" <${SMTP_USER}>`,
      to,
      replyTo: lead.email,
      subject: `New inquiry from ${lead.name}${lead.organization ? ` (${lead.organization})` : ''}`,
      text: rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n'),
    })
    console.log(`[smtp] ✓ email sent in ${Date.now() - t0} ms: id=${info.messageId} accepted=${info.accepted.join(', ') || 'none'} rejected=${info.rejected.join(', ') || 'none'} response="${info.response}"`)
  } catch (err) {
    const e = err as { code?: string; responseCode?: number; response?: string; message?: string }
    const hint =
      e.code === 'EAUTH' || e.responseCode === 535 ? 'Gmail rejected the login: SMTP_PASS must be a 16-character App Password (2-Step Verification on), not the account password.'
      : e.code === 'ETIMEDOUT' || e.code === 'ECONNECTION' || e.code === 'ESOCKET' ? 'Could not reach smtp.gmail.com:465 (network or firewall).'
      : e.responseCode === 550 || e.responseCode === 553 ? 'Recipient was rejected: check LEAD_EMAIL_TO.'
      : 'See the Gmail response.'
    console.error(`[smtp] ✗ email FAILED after ${Date.now() - t0} ms: code=${e.code ?? '-'} status=${e.responseCode ?? '-'} response="${e.response ?? e.message}" → ${hint}`)
    throw err
  }
}
