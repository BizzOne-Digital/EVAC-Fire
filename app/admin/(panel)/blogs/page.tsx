import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ActionButton } from '@/components/admin/action-button'
import { Badge, Empty, PageHeader, Pagination, SortHeader, Toolbar, formatDate, sortSpec } from '@/components/admin/ui'
import { PAGE_SIZE, contains, pageParams } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'
import { deletePost, setPostStatus } from './actions'

export const metadata = { title: 'Blog posts' }

const STATUS = [
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Draft' },
]

export default async function Blogs({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin()
  const sp = await searchParams
  const { one, page, skip } = pageParams(sp)
  const q = one('q')
  const status = one('status')
  const now = new Date()
  const statusFilter =
    status === 'draft' ? { status: 'draft' as const }
    : status === 'scheduled' ? { status: 'published' as const, publishedAt: { $gt: now } }
    : status === 'published' ? { status: 'published' as const, $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] }
    : {}
  const filter = { ...statusFilter, ...(q && { $and: [{ $or: [{ title: contains(q) }, { category: contains(q) }, { tags: contains(q) }] }] }) }
  const c = await collections()
  const [rows, total] = await Promise.all([
    c.posts.find(filter, { projection: { body: 0 } }).sort(sortSpec(one('sort'), ['title', 'publishedAt', 'updatedAt', 'author'], { updatedAt: -1, _id: 1 })).skip(skip).limit(PAGE_SIZE).toArray(),
    c.posts.countDocuments(filter),
  ])

  return (
    <>
      <PageHeader
        title="Blog posts"
        actions={
          <>
            <Link className="a-btn" href="/admin/pages/blogs">Edit blog page intro</Link>
            <Link className="a-btn a-btn--primary" href="/admin/blogs/new"><Plus aria-hidden="true" /> New post</Link>
          </>
        }
      />
      <Toolbar params={sp} placeholder="Search title, category or tag" filters={[{ name: 'status', label: 'Status', options: STATUS }]} />
      {rows.length === 0 ? (
        <Empty title={q || status ? 'No posts match your search.' : 'No blog posts yet.'}>
          <Link className="a-btn a-btn--primary" href="/admin/blogs/new">Write a post</Link>
        </Empty>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <SortHeader params={sp} field="title">Title</SortHeader>
                <th scope="col">Status</th>
                <SortHeader params={sp} field="author">Author</SortHeader>
                <SortHeader params={sp} field="publishedAt">Published</SortHeader>
                <SortHeader params={sp} field="updatedAt">Updated</SortHeader>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(p => {
                const id = String(p._id)
                const state = p.status === 'draft' ? 'draft' : p.publishedAt && p.publishedAt > now ? 'scheduled' : 'published'
                return (
                  <tr key={id}>
                    <td data-label="Title">
                      <Link href={`/admin/blogs/${id}`} className="a-strong">{p.title}</Link>
                      <span className="a-sub">{p.category || 'No category'}</span>
                    </td>
                    <td data-label="Status"><Badge status={state} /></td>
                    <td data-label="Author">{p.author || <span className="a-muted">Company</span>}</td>
                    <td data-label="Published">{formatDate(p.publishedAt)}</td>
                    <td data-label="Updated">{formatDate(p.updatedAt)}</td>
                    <td className="a-actions">
                      <Link className="a-btn" href={`/admin/blogs/${id}`}>Edit</Link>
                      <ActionButton action={setPostStatus.bind(null, id, p.status === 'draft' ? 'published' : 'draft')}>{p.status === 'draft' ? 'Publish' : 'Unpublish'}</ActionButton>
                      <ActionButton danger action={deletePost.bind(null, id)} confirm={`Delete “${p.title}”? This cannot be undone.`}>Delete</ActionButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination params={sp} total={total} page={page} />
        </div>
      )}
    </>
  )
}
