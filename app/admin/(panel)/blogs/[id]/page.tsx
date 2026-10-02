import { notFound } from 'next/navigation'
import { ActionButton } from '@/components/admin/action-button'
import { PostForm } from '@/components/admin/post-form'
import { PageHeader } from '@/components/admin/ui'
import { plain } from '@/lib/admin'
import { requireAdmin } from '@/lib/auth'
import { collections, oid } from '@/lib/db'
import { deletePostAndReturn } from '../actions'
import { postOptions } from '../options'

export const metadata = { title: 'Edit post' }

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdmin()
  const id = (await params).id
  const _id = oid(id)
  const post = _id && (await (await collections()).posts.findOne({ _id }))
  if (!post) notFound()
  const { _id: _, createdAt, updatedAt, ...v } = plain(post)
  const live = post.status === 'published' && (!post.publishedAt || post.publishedAt <= new Date())
  return (
    <>
      <PageHeader
        title={post.title}
        crumbs={[['Blog posts', '/admin/blogs']]}
        actions={
          <>
            {live && <a className="a-btn" href={`/blogs/${post.slug}`} target="_blank" rel="noopener">View post</a>}
            <ActionButton danger action={deletePostAndReturn.bind(null, id)} confirm={`Delete “${post.title}”? This cannot be undone.`}>Delete</ActionButton>
          </>
        }
      />
      {(await searchParams).created && <p className="a-notice" role="status">Post created.</p>}
      <PostForm v={v} id={id} {...await postOptions()} />
    </>
  )
}
