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
