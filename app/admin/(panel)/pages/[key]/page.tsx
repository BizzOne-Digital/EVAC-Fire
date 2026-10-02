import { notFound } from 'next/navigation'
import { AboutForm, BlogsPageForm, ContactPageForm, HomeForm, ServicesPageForm } from '@/components/admin/doc-forms'
import { PageHeader } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { getDoc } from '@/lib/cms'

const PAGES = {
  home: { title: 'Home page', path: '/', Form: HomeForm },
  about: { title: 'About page', path: '/about', Form: AboutForm },
  services: { title: 'Services page', path: '/services', Form: ServicesPageForm },
  blogs: { title: 'Blog page', path: '/blogs', Form: BlogsPageForm },
  contact: { title: 'Contact page', path: '/contact', Form: ContactPageForm },
} as const

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const page = PAGES[(await params).key as keyof typeof PAGES]
  return { title: page?.title ?? 'Page' }
}

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  await requireAdmin()
  const key = (await params).key
  if (!Object.hasOwn(PAGES, key)) notFound()
  const { title, path, Form } = PAGES[key as keyof typeof PAGES]
  const value = await getDoc(key as keyof typeof PAGES)
  return (
    <>
      <PageHeader
        title={title}
        description="Changes go live on the website as soon as you save."
        actions={<a className="a-btn" href={path} target="_blank" rel="noopener">View page</a>}
      />
      <Form v={value as never} />
    </>
  )
}
