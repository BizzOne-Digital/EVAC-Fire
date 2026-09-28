'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/** Adds `.is-in` to every [data-reveal] element once it scrolls into view. Motion lives in CSS. */
export function RevealObserver() {
  const pathname = usePathname()
  const initial = useRef(pathname)
  // Enables the page-transition curtain from the first client-side route change onward.
  useEffect(() => {
    if (pathname !== initial.current) document.documentElement.classList.add('navigated')
  }, [pathname])
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    )
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return null
}
