import { SettingsForm } from '@/components/admin/doc-forms'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { getDoc } from '@/lib/cms'

export const metadata = { title: 'Site settings' }

export default async function Page() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="Site settings" description="Business details used across the whole website." />
      <SettingsForm v={await getDoc('settings')} />
    </>
  )
}
