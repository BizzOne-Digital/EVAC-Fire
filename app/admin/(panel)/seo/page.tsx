import { SeoForm } from '@/components/admin/doc-forms'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { getDoc } from '@/lib/cms'

export const metadata = { title: 'SEO' }

export default async function Page() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="SEO" description="Titles, descriptions and share images for search engines and social media." />
      <SeoForm v={await getDoc('seo')} />
    </>
  )
}
