'use client'

import { updateInquiry } from '@/app/admin/(panel)/inquiries/actions'
import { AdminForm, Area, Card, Select } from './form'

export function InquiryForm({ id, status, notes, labels }: { id: string; status: string; notes: string; labels: Record<string, string> }) {
  return (
    <AdminForm action={updateInquiry.bind(null, id)} submitLabel="Update inquiry">
      <Card title="Follow-up">
        <Select name="status" label="Status" value={status} required options={Object.entries(labels).map(([value, label]) => ({ value, label }))} />
        <Area name="notes" label="Internal notes" value={notes} rows={8} max={5000} hint="Only visible in the admin." />
      </Card>
    </AdminForm>
  )
}
