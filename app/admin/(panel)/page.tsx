import Link from 'next/link'
import { Badge, Empty, PageHeader, formatDate } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'
import { STATUS_LABELS } from './inquiries/labels'

export const metadata = { title: 'Dashboard' }

const EDITORS = [
  ['Home page', '/admin/pages/home'],
  ['About page', '/admin/pages/about'],
  ['Services', '/admin/services'],
  ['Write a blog post', '/admin/blogs/new'],
  ['Site settings', '/admin/settings'],
  ['SEO', '/admin/seo'],
] as const

export default async function Dashboard() {
  const admin = await requireAdmin()
  const c = await collections()
  const now = new Date()
  const live = { status: 'published' as const, $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] }
  const [posts, published, drafts, scheduled, services, servicesLive, inquiries, fresh, recent] = await Promise.all([
    c.posts.countDocuments(),
    c.posts.countDocuments(live),
    c.posts.countDocuments({ status: 'draft' }),
    c.posts.countDocuments({ status: 'published', publishedAt: { $gt: now } }),
    c.services.countDocuments(),
    c.services.countDocuments({ published: true }),
    c.inquiries.countDocuments(),
    c.inquiries.countDocuments({ status: 'new' }),
    c.inquiries.find({}, { projection: { name: 1, organization: 1, serviceLabel: 1, status: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(6).toArray(),
  ])

  const stats: [string, number, string, string][] = [
    ['New inquiries', fresh, `${inquiries} total`, '/admin/inquiries?status=new'],
    ['Published posts', published, `${drafts} draft${drafts === 1 ? '' : 's'}${scheduled ? ` · ${scheduled} scheduled` : ''} · ${posts} total`, '/admin/blogs'],
    ['Live services', servicesLive, `${services} total`, '/admin/services'],
  ]

  return (
    <>
      <PageHeader title={`Welcome${admin.name ? `, ${admin.name}` : ''}`} description="What needs attention on the EVAC Fire & Safety website." />
      <div className="a-stats">
        {stats.map(([label, value, sub, href]) => (
          <Link key={label} href={href} className={`a-stat ${label === 'New inquiries' && value > 0 ? 'a-stat--hot' : ''}`}>
            <span className="a-stat-label">{label}</span>
            <span className="a-stat-value">{value}</span>
            <span className="a-sub">{sub}</span>
          </Link>
        ))}
      </div>

      <div className="a-dash">
        <section className="a-card">
          <div className="a-card-head">
            <h2 className="a-card-title">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="a-btn a-btn--quiet">View all</Link>
          </div>
          {recent.length === 0 ? (
            <Empty title="No inquiries yet. Contact-form submissions will appear here." />
          ) : (
            <ul className="a-list">
              {recent.map(r => (
                <li key={String(r._id)}>
                  <Link href={`/admin/inquiries/${r._id}`}>
                    <span className="a-strong">{r.name}</span>
                    <span className="a-sub">{[r.organization, r.serviceLabel].filter(Boolean).join(' · ')}</span>
                  </Link>
                  <Badge status={r.status}>{STATUS_LABELS[r.status]}</Badge>
                  <span className="a-sub">{formatDate(r.createdAt, true)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="a-card">
          <h2 className="a-card-title">Edit the website</h2>
          <ul className="a-quick">
            {EDITORS.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
          </ul>
        </section>
      </div>
    </>
  )
}
