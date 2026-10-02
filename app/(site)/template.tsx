// Remounts on every navigation. The curtain only animates once `html.navigated` is set
// (after the first client-side route change), so it never plays on the initial load.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-curtain" aria-hidden="true" />
      {children}
    </>
  )
}
