import Link from 'next/link'
import { Badge, Empty, PageHeader, Pagination, SortHeader, Toolbar, formatDate, sortSpec } from '@/components/admin/ui'
import { PAGE_SIZE, contains, pageParams } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { INQUIRY_STATUSES, collections } from '@/lib/db'
import { STATUS_LABELS } from './labels'

export const metadata = { title: 'Inquiries' }


export default async function Inquiries({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin()
  const sp = await searchParams
  const { one, page, skip } = pageParams(sp)
  const q = one('q')
  const status = one('status')
  const service = one('service')
  const c = await collections()
  const filter = {
    ...(q && { $or: [{ name: contains(q) }, { email: contains(q) }, { organization: contains(q) }, { phone: contains(q) }] }),
    // "Open" hides archived; an explicit status shows exactly that status.
    ...(status ? (INQUIRY_STATUSES as readonly string[]).includes(status) && { status: status as never } : { status: { $ne: 'archived' as const } }),
    ...(service && { service }),
  }
  const [rows, total, services] = await Promise.all([
    c.inquiries.find(filter, { projection: { message: 0, notes: 0 } }).sort(sortSpec(one('sort'), ['name', 'createdAt', 'status'], { createdAt: -1, _id: 1 })).skip(skip).limit(PAGE_SIZE).toArray(),
    c.inquiries.countDocuments(filter),
    c.inquiries.aggregate<{ _id: string; label: string }>([{ $group: { _id: '$service', label: { $last: '$serviceLabel' } } }, { $sort: { label: 1 } }]).toArray(),
  ])

  return (
    <>
      <PageHeader title="Inquiries" description="Every contact-form submission, including which service was requested. Archived inquiries are hidden unless you filter for them." />
      <Toolbar
        params={sp}
        placeholder="Search name, email, company or phone"
        filters={[
          { name: 'status', label: 'Status', options: INQUIRY_STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] })) },
          { name: 'service', label: 'Service', options: services.map(s => ({ value: s._id, label: s.label || s._id })) },
        ]}
      />
      {rows.length === 0 ? (
        <Empty title={q || status || service ? 'No inquiries match your filters.' : 'No inquiries yet. Contact-form submissions will appear here.'} />
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <SortHeader params={sp} field="name">Name</SortHeader>
                <th scope="col">Email</th>
                <th scope="col">Service</th>
                <SortHeader params={sp} field="status">Status</SortHeader>
                <SortHeader params={sp} field="createdAt">Submitted</SortHeader>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={String(r._id)} className={r.status === 'new' ? 'a-row-new' : undefined}>
                  <td data-label="Name">
                    <Link href={`/admin/inquiries/${r._id}`} className="a-strong">{r.name}</Link>
                    <span className="a-sub">{r.organization}</span>
                  </td>
                  <td data-label="Email"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td data-label="Service">{r.serviceLabel || r.service}</td>
                  <td data-label="Status"><Badge status={r.status}>{STATUS_LABELS[r.status]}</Badge></td>
                  <td data-label="Submitted">{formatDate(r.createdAt, true)}</td>
                  <td className="a-actions"><Link className="a-btn" href={`/admin/inquiries/${r._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination params={sp} total={total} page={page} />
        </div>
      )}
    </>
  )
}
