import { PostForm, blankPost } from '@/components/admin/post-form'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { postOptions } from '../options'

export const metadata = { title: 'New post' }

export default async function NewPost() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New post" crumbs={[['Blog posts', '/admin/blogs']]} />
      <PostForm v={blankPost} id={null} {...await postOptions()} />
    </>
  )
}
