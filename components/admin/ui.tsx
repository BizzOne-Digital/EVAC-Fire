import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PAGE_SIZE } from '@/lib/admin'

export function PageHeader({ title, crumbs = [], actions, description }: { title: string; crumbs?: [string, string][]; actions?: ReactNode; description?: string }) {
  return (
    <header className="a-head">
      <nav aria-label="Breadcrumb" className="a-crumbs">
        <ol>
          <li><Link href="/admin">Dashboard</Link></li>
          {crumbs.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="a-head-row">
        <div>
          <h1>{title}</h1>
          {description && <p className="a-head-desc">{description}</p>}
        </div>
        {actions && <div className="a-inline">{actions}</div>}
      </div>
    </header>
  )
}

const TONES: Record<string, string> = {
  published: 'ok', live: 'ok', completed: 'ok', new: 'hot', scheduled: 'info', contacted: 'info', in_progress: 'warn', draft: 'muted', hidden: 'muted', archived: 'muted',
}
export function Badge({ status, children }: { status: string; children?: ReactNode }) {
  return <span className={`a-badge a-badge--${TONES[status] ?? 'muted'}`}>{children ?? status.replace('_', ' ')}</span>
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="a-empty">
      <p className="a-empty-title">{title}</p>
      {children}
    </div>
  )
}

export const formatDate = (d: Date | string | null | undefined, withTime = false) =>
  d ? new Date(d).toLocaleString('en-CA', { dateStyle: 'medium', ...(withTime && { timeStyle: 'short' }), timeZone: 'America/Toronto' }) : '—'

type SP = Record<string, string>
const qs = (base: SP, patch: SP) => {
  const p = new URLSearchParams({ ...base, ...patch })
  for (const [k, v] of [...p]) if (!v) p.delete(k)
  return `?${p}`
}

/** GET search/filter bar: works without JavaScript and keeps state in the URL. */
export function Toolbar({ params, placeholder, filters = [] }: { params: SP; placeholder: string; filters?: { name: string; label: string; options: { value: string; label: string }[] }[] }) {
  return (
    <form className="a-toolbar" role="search">
      <input type="search" name="q" className="a-search" defaultValue={params.q} placeholder={placeholder} aria-label={placeholder} />
      {filters.map(f => (
        <select key={f.name} name={f.name} defaultValue={params[f.name] ?? ''} aria-label={f.label} className="a-select">
          <option value="">{f.label}: all</option>
          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
      {params.sort && <input type="hidden" name="sort" value={params.sort} />}
      <button className="a-btn" type="submit">Apply</button>
      {(params.q || filters.some(f => params[f.name])) && <Link className="a-btn a-btn--quiet" href="?">Clear</Link>}
    </form>
  )
}

/** Sortable column header. `sort` is `field` (ascending) or `-field` (descending). */
export function SortHeader({ params, field, children }: { params: SP; field: string; children: ReactNode }) {
  const current = params.sort ?? ''
  const asc = current === field
  const desc = current === `-${field}`
  return (
    <th scope="col" aria-sort={asc ? 'ascending' : desc ? 'descending' : undefined}>
      <Link href={qs(params, { sort: asc ? `-${field}` : field, page: '' })} className="a-sort">
        {children}
        {asc ? <ChevronUp aria-hidden="true" /> : desc ? <ChevronDown aria-hidden="true" /> : null}
      </Link>
    </th>
  )
}

export function Pagination({ params, total, page }: { params: SP; total: number; page: number }) {
  const pages = Math.ceil(total / PAGE_SIZE)
  if (pages <= 1) return <p className="a-muted a-count-line">{total} {total === 1 ? 'item' : 'items'}</p>
  return (
    <nav className="a-pages" aria-label="Pagination">
      <span className="a-muted">Page {page} of {pages} · {total} items</span>
      {page > 1 && <Link className="a-btn" href={qs(params, { page: String(page - 1) })}>Previous</Link>}
      {page < pages && <Link className="a-btn" href={qs(params, { page: String(page + 1) })}>Next</Link>}
    </nav>
  )
}

/** Reads one sort spec into a MongoDB sort, restricted to known fields. */
export function sortSpec(sort: string | undefined, allowed: string[], fallback: Record<string, 1 | -1>): Record<string, 1 | -1> {
  const field = sort?.replace(/^-/, '')
  return field && allowed.includes(field) ? { [field]: sort!.startsWith('-') ? -1 : 1, _id: 1 } : fallback
}
