import type { InquiryData } from './inquiry'

export type Lead = InquiryData & { serviceLabel: string; submittedAt: string; source: string }

/**
 * Delivers a lead to the client's destination.
 * Set LEAD_WEBHOOK_URL to any endpoint that accepts a JSON POST
 * (Zapier / Make / HubSpot / CRM webhook, or an email relay).
 */
export async function deliverLead(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[inquiry] LEAD_WEBHOOK_URL not set; lead logged locally only:', lead)
      return
    }
    throw new Error('LEAD_WEBHOOK_URL is not configured')
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lead),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`)
}
