import { AccountForms } from '@/components/admin/account-forms'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'

export const metadata = { title: 'Admin account' }

export default async function Account() {
  const admin = await requireAdmin()
  return (
    <>
      <PageHeader title="Admin account" description="Your sign-in details. Passwords are stored as one-way scrypt hashes." />
      <AccountForms name={admin.name} email={admin.email} />
    </>
  )
}
