import Link from 'next/link'

// Outside the public site (e.g. unknown /admin URLs). Public 404s use app/(site)/not-found.tsx.
export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
      <h1 style={{ margin: 0 }}>Page not found</h1>
      <p style={{ margin: 0 }}><Link href="/">Back to the website</Link> · <Link href="/admin">Admin dashboard</Link></p>
    </main>
  )
}
