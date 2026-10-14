import { Sidebar } from '@/components/admin/sidebar'
import { Toaster } from '@/components/admin/toast'
import { requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'

export default async function Panel({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  const newInquiries = await (await collections()).inquiries.countDocuments({ status: 'new' })
  return (
    <div className="a-shell">
      <Sidebar email={admin.email} newInquiries={newInquiries} />
      <main className="a-main" id="main">{children}</main>
      <Toaster />
    </div>
  )
}
