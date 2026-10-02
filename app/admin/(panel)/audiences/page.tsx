import { ListPage } from '../lists/views'

export const metadata = { title: 'Who we serve' }

export default function Page() {
  return <ListPage kind="audiences" />
}
