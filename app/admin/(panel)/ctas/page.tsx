import { CtasForm } from '@/components/admin/doc-forms'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { getDoc } from '@/lib/cms'

export const metadata = { title: 'Calls to action' }

export default async function Page() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="Calls to action" description="Buttons and closing sections shared across the website." />
      <CtasForm v={await getDoc('ctas')} />
    </>
  )
}
