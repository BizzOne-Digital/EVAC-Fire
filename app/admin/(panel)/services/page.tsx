import Link from 'next/link'
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import { ActionButton } from '@/components/admin/action-button'
import { Badge, Empty, PageHeader, SortHeader, Toolbar, formatDate, sortSpec } from '@/components/admin/ui'
import { contains, pageParams } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'
import { deleteService, moveService, toggleService } from './actions'

export const metadata = { title: 'Services' }

export default async function Services({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin()
  const sp = await searchParams
  const { one } = pageParams(sp)
  const q = one('q')
  const status = one('status')
  const filter = { ...(q && { $or: [{ title: contains(q) }, { slug: contains(q) }] }), ...(status && { published: status === 'published' }) }
  const sort = sortSpec(one('sort'), ['title', 'updatedAt', 'sortOrder'], { sortOrder: 1, _id: 1 })
  const rows = await (await collections()).services.find(filter, { projection: { title: 1, slug: 1, published: 1, featured: 1, sortOrder: 1, updatedAt: 1 } }).sort(sort).toArray()
  const ordered = !q && !status && !one('sort')

  return (
    <>
      <PageHeader
        title="Services"
        description="Shown on the home page, the services page, the footer and in the contact form."
        actions={
          <>
            <Link className="a-btn" href="/admin/pages/services">Edit services page intro</Link>
            <Link className="a-btn a-btn--primary" href="/admin/services/new"><Plus aria-hidden="true" /> New service</Link>
          </>
        }
      />
      <Toolbar params={sp} placeholder="Search services" filters={[{ name: 'status', label: 'Status', options: [{ value: 'published', label: 'Published' }, { value: 'hidden', label: 'Hidden' }] }]} />
      {rows.length === 0 ? (
        <Empty title={q || status ? 'No services match your search.' : 'No services yet.'}>
          <Link className="a-btn a-btn--primary" href="/admin/services/new">Create a service</Link>
        </Empty>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <SortHeader params={sp} field="title">Service</SortHeader>
                <th scope="col">Status</th>
                <SortHeader params={sp} field="sortOrder">Order</SortHeader>
                <SortHeader params={sp} field="updatedAt">Updated</SortHeader>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => {
                const id = String(s._id)
                return (
                  <tr key={id}>
                    <td data-label="Service">
                      <Link href={`/admin/services/${id}`} className="a-strong">{s.title}</Link>
                      <span className="a-sub">/services#{s.slug}</span>
                    </td>
                    <td data-label="Status">
                      <Badge status={s.published ? 'published' : 'hidden'} />
                      {s.featured && s.published && <Badge status="info">home</Badge>}
                    </td>
                    <td data-label="Order">
                      {ordered ? (
                        <span className="a-inline">
                          <ActionButton className="a-icon-btn" label={`Move ${s.title} up`} action={moveService.bind(null, id, -1)}><ArrowUp /></ActionButton>
                          <ActionButton className="a-icon-btn" label={`Move ${s.title} down`} action={moveService.bind(null, id, 1)}><ArrowDown /></ActionButton>
                        </span>
                      ) : (
                        <span className="a-muted">{i + 1}</span>
                      )}
                    </td>
                    <td data-label="Updated">{formatDate(s.updatedAt)}</td>
                    <td className="a-actions">
                      <Link className="a-btn" href={`/admin/services/${id}`}>Edit</Link>
                      <ActionButton action={toggleService.bind(null, id)}>{s.published ? 'Unpublish' : 'Publish'}</ActionButton>
                      <ActionButton danger action={deleteService.bind(null, id)} confirm={`Delete “${s.title}”? Blog posts linked to it will lose their related-service box. This cannot be undone.`}>Delete</ActionButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!ordered && <p className="a-muted a-count-line">Clear the search and sorting to reorder services.</p>}
        </div>
      )}
    </>
  )
}
