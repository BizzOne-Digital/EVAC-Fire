import { notFound } from 'next/navigation'
import { ActionButton } from '@/components/admin/action-button'
import { ServiceForm } from '@/components/admin/service-form'
import { PageHeader } from '@/components/admin/ui'
import { plain } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { collections, oid } from '@/lib/db'
import { deleteServiceAndReturn } from '../actions'

export const metadata = { title: 'Edit service' }

export default async function EditService({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin()
  const id = (await params).id
  const _id = oid(id)
  const s = _id && (await (await collections()).services.findOne({ _id }))
  if (!s) notFound()
  const { _id: _, createdAt, updatedAt, sortOrder, ...v } = plain(s)
  return (
    <>
      <PageHeader
        title={s.title}
        crumbs={[['Services', '/admin/services']]}
        actions={
          <>
            {s.published && <a className="a-btn" href={`/services#${s.slug}`} target="_blank" rel="noopener">View on site</a>}
            <ActionButton danger action={deleteServiceAndReturn.bind(null, id)} confirm={`Delete “${s.title}”? This cannot be undone.`}>Delete</ActionButton>
          </>
        }
      />
      {(await searchParams).created && <p className="a-notice" role="status">Service created.</p>}
      <ServiceForm v={v} id={id} />
    </>
  )
}
