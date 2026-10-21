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

/** Emails each new inquiry via SMTP (default Microsoft 365) when SMTP_USER and SMTP_PASS are set. Server-only. */
export async function emailLead(lead: Lead) {
  const { SMTP_USER, SMTP_PASS, LEAD_EMAIL_TO, SMTP_HOST = 'smtp.office365.com' } = process.env
  const port = Number(process.env.SMTP_PORT || 587)
  // 465 = implicit TLS; 587 = STARTTLS (required by Microsoft 365)
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  const rows: [string, string][] = [
    ['Name', lead.name], ['Organization', lead.organization], ['Email', lead.email], ['Phone', lead.phone],
    ['Property type', lead.propertyType], ['Service', lead.serviceLabel], ['Message', lead.message], ['Submitted', lead.submittedAt],
  ]
  await transport.verify() // throws with the server's reason on bad host/auth
  console.log(`[smtp] connected to ${SMTP_HOST}:${port} as ${SMTP_USER}`)
  const info = await transport.sendMail({
    from: `"Website Inquiry" <${SMTP_USER}>`,
    to: LEAD_EMAIL_TO || SMTP_USER,
    replyTo: lead.email,
    subject: `New inquiry from ${lead.name}${lead.organization ? ` (${lead.organization})` : ''}`,
    text: rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n'),
  })
  console.log(`[smtp] sent ${info.messageId} to ${info.accepted.join(', ')} (rejected: ${info.rejected.join(', ') || 'none'})`)
}
