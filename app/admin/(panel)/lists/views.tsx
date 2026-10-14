import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import { ActionButton } from '@/components/admin/action-button'
import { ListItemForm } from '@/components/admin/list-item-form'
import { Badge, Empty, PageHeader, formatDate } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { collections, oid } from '@/lib/db'
import { deleteListItem, moveListItem, toggleListItem } from './actions'
import { LISTS, type ListKind } from './config'

export async function ListPage({ kind }: { kind: ListKind }) {
  await requireAdmin()
  const cfg = LISTS[kind]
  const rows = await (await collections())[kind].find().sort({ sortOrder: 1, _id: 1 }).toArray()
  return (
    <>
      <PageHeader
        title={cfg.title}
        description={cfg.description}
        actions={
          <>
            <Link className="a-btn" href={cfg.sectionHref}>Edit section heading</Link>
            <Link className="a-btn a-btn--primary" href={`/admin/${kind}/new`}><Plus aria-hidden="true" /> New {cfg.singular}</Link>
          </>
        }
      />
      {rows.length === 0 ? (
        <Empty title={`No ${cfg.singular}s yet. The section is hidden on the website until you add one.`}>
          <Link className="a-btn a-btn--primary" href={`/admin/${kind}/new`}>Add the first {cfg.singular}</Link>
        </Empty>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr><th scope="col">Title</th><th scope="col">Status</th><th scope="col">Order</th><th scope="col">Updated</th><th scope="col"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const id = String(r._id)
                return (
                  <tr key={id}>
                    <td data-label="Title">
                      <Link href={`/admin/${kind}/${id}`} className="a-strong">{r.title}</Link>
                      <span className="a-sub">{r.items.length} {r.items.length === 1 ? 'line' : 'lines'}</span>
                    </td>
                    <td data-label="Status"><Badge status={r.published ? 'published' : 'hidden'} /></td>
                    <td data-label="Order">
                      <span className="a-inline">
                        <ActionButton className="a-icon-btn" label={`Move ${r.title} up`} action={moveListItem.bind(null, kind, id, -1)}><ArrowUp /></ActionButton>
                        <ActionButton className="a-icon-btn" label={`Move ${r.title} down`} action={moveListItem.bind(null, kind, id, 1)}><ArrowDown /></ActionButton>
                      </span>
                    </td>
                    <td data-label="Updated">{formatDate(r.updatedAt)}</td>
                    <td className="a-actions">
                      <Link className="a-btn" href={`/admin/${kind}/${id}`}>Edit</Link>
                      <ActionButton action={toggleListItem.bind(null, kind, id)}>{r.published ? 'Unpublish' : 'Publish'}</ActionButton>
                      <ActionButton danger action={deleteListItem.bind(null, kind, id)} confirm={`Delete “${r.title}”? This cannot be undone.`}>Delete</ActionButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export async function ListItemPage({ kind, id }: { kind: ListKind; id: string }) {
  await requireAdmin()
  const cfg = LISTS[kind]
  const isNew = id === 'new'
  const item = isNew ? null : oid(id) && (await (await collections())[kind].findOne({ _id: oid(id)! }))
  if (!isNew && !item) notFound()
  return (
    <>
      <PageHeader title={item ? item.title : `New ${cfg.singular}`} crumbs={[[cfg.title, `/admin/${kind}`]]} />
      <ListItemForm kind={kind} id={isNew ? null : id} itemsLabel={cfg.itemsLabel} v={item ? { title: item.title, items: item.items, published: item.published } : { title: '', items: [], published: true }} />
    </>
  )
}
