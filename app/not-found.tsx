import { ButtonLink, PageIntro } from '@/components/ui'

export default function NotFound() {
  return (
    <PageIntro label="Page not found" lines={['This route', <>doesn&apos;t <em>exist.</em></>]}>
      <p>The page you are looking for may have moved. Use the navigation, or head back to the homepage.</p>
      <div className="page-intro-actions"><ButtonLink href="/">Back to home</ButtonLink></div>
    </PageIntro>
  )
}
