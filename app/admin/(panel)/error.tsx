'use client'

// Friendly fallback for unexpected admin errors. Details stay in the server logs, never on screen.
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="a-empty" role="alert">
      <p className="a-empty-title">Something went wrong loading this page.</p>
      <p className="a-muted">Please try again. If it keeps happening, check that the database is reachable.</p>
      <button type="button" className="a-btn a-btn--primary" onClick={reset}>Try again</button>
    </div>
  )
}
