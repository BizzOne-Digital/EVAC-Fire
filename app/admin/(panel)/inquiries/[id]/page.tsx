import { notFound } from 'next/navigation'
import { ActionButton } from '@/components/admin/action-button'
import { InquiryForm } from '@/components/admin/inquiry-form'
import { Badge, PageHeader, formatDate } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { collections, oid } from '@/lib/db'
import { deleteInquiry } from '../actions'
import { STATUS_LABELS } from '../labels'

export const metadata = { title: 'Inquiry' }

export default async function Inquiry({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const id = (await params).id
  const _id = oid(id)
  const r = _id && (await (await collections()).inquiries.findOne({ _id }))
  if (!r) notFound()
  const rows: [string, React.ReactNode][] = [
    ['Email', <a key="e" href={`mailto:${r.email}`}>{r.email}</a>],
    ['Phone', r.phone ? <a key="p" href={`tel:${r.phone}`}>{r.phone}</a> : '—'],
    ['Company / organization', r.organization || '—'],
    ['Property / building type', r.propertyType || '—'],
    ['Service requested', r.serviceLabel || r.service || '—'],
    ['Submitted', formatDate(r.createdAt, true)],
    ['Last updated', formatDate(r.updatedAt, true)],
  ]
  return (
    <>
      <PageHeader
        title={r.name}
        crumbs={[['Inquiries', '/admin/inquiries']]}
        actions={<ActionButton danger action={deleteInquiry.bind(null, id)} confirm={`Delete the inquiry from ${r.name}? This cannot be undone. Consider archiving instead.`}>Delete</ActionButton>}
      />
      <div className="a-form-layout">
        <div className="a-form-main">
          <section className="a-card">
            <h2 className="a-card-title">Inquiry <Badge status={r.status}>{STATUS_LABELS[r.status]}</Badge></h2>
            <dl className="a-dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <h3 className="a-subhead">Message</h3>
            <p className="a-message">{r.message}</p>
          </section>
        </div>
        <div className="a-form-aside">
          <InquiryForm id={id} status={r.status} notes={r.notes} labels={STATUS_LABELS} />
        </div>
      </div>
    </>
  )
}
