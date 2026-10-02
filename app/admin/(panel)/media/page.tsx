import { MediaLibrary } from '@/components/admin/media-library'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { collections } from '@/lib/db'

export const metadata = { title: 'Media library' }

export default async function Media() {
  await requireAdmin()
  const rows = await (await collections()).media.find({}, { projection: { data: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray()
  const items = rows.map(m => ({ id: String(m._id), url: m.url, filename: m.filename, alt: m.alt, width: m.width, height: m.height, size: m.size, uploaded: m.url.startsWith('/media/') }))
  return (
    <>
      <PageHeader title="Media library" description="Images stored with the website. Choose them from any image field." />
      <MediaLibrary items={items} />
    </>
  )
}
