'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { contactHref, site } from '@/lib/site'
import { Logo } from './ui'

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu after navigating. Native <dialog> handles Escape, focus trap and focus return.
  useEffect(() => menu.current?.close(), [pathname])

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {site.nav.map(item => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={contactHref()} className="btn btn--sm header-cta">
          <span>Request a consultation</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <button type="button" className="menu-button" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}>
          <Menu aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      <dialog ref={menu} className="menu tone-dark" aria-label="Menu">
        <div className="shell menu-top">
          <Link href="/" className="brand" aria-label={`${site.name} home`}>
            <Logo />
          </Link>
          <button type="button" className="menu-button" onClick={() => menu.current?.close()} autoFocus>
            <X aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav className="shell menu-nav" aria-label="Mobile">
          {site.nav.map((item, i) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined} style={{ '--i': i } as CSSProperties} onClick={() => menu.current?.close()}>
              <span className="menu-num" aria-hidden="true">0{i + 1}</span>
              {item.label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="shell menu-foot">
          <Link href={contactHref()} className="btn" onClick={() => menu.current?.close()}>
            <span>Request a consultation</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p>{site.tagline}</p>
        </div>
      </dialog>
    </header>
  )
}
