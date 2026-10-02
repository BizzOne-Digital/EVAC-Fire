'use client'

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="page-intro tone-dark">
      <div className="shell">
        <p className="label">Something went wrong</p>
        <h1>We couldn&apos;t load this page.</h1>
        <div className="page-intro-copy" style={{ opacity: 1 }}>
          <p>Please try again in a moment.</p>
          <button type="button" className="btn" onClick={reset}><span>Try again</span></button>
        </div>
      </div>
    </section>
  )
}
