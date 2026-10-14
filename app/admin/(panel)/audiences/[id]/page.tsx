import { ListItemPage } from '../../lists/views'

export const metadata = { title: 'Edit' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ListItemPage kind="audiences" id={(await params).id} />
}
