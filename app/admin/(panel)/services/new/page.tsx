import { ServiceForm, blankService } from '@/components/admin/service-form'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'

export const metadata = { title: 'New service' }

export default async function NewService() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New service" crumbs={[['Services', '/admin/services']]} description="New services start unpublished, so you can review them first." />
      <ServiceForm v={blankService} id={null} />
    </>
  )
}
