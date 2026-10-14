'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { BookOpen, ExternalLink, FileText, Home, Image as ImageIcon, Inbox, Info, LayoutDashboard, ListChecks, LogOut, Megaphone, Menu, Phone, Search, Settings, ShieldCheck, Users, Wrench } from 'lucide-react'
import { signOut } from '@/app/admin/login/actions'

const NAV = [
  { group: '', items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    group: 'Content',
    items: [
      { href: '/admin/pages/home', label: 'Home page', icon: Home },
      { href: '/admin/pages/about', label: 'About page', icon: Info },
      { href: '/admin/services', label: 'Services', icon: Wrench },
      { href: '/admin/blogs', label: 'Blog posts', icon: BookOpen },
      { href: '/admin/audiences', label: 'Who we serve', icon: Users },
      { href: '/admin/approach', label: 'Our approach', icon: ListChecks },
      { href: '/admin/ctas', label: 'Calls to action', icon: Megaphone },
      { href: '/admin/pages/contact', label: 'Contact page', icon: Phone },
    ],
  },
  { group: 'Leads', items: [{ href: '/admin/inquiries', label: 'Inquiries', icon: Inbox }] },
  { group: 'Media', items: [{ href: '/admin/media', label: 'Media library', icon: ImageIcon }] },
  {
    group: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Site settings', icon: Settings },
      { href: '/admin/seo', label: 'SEO', icon: Search },
      { href: '/admin/account', label: 'Admin account', icon: ShieldCheck },
    ],
  },
]

const active = (path: string, href: string) => (href === '/admin' ? path === href : path === href || path.startsWith(`${href}/`))

export function Sidebar({ email, newInquiries }: { email: string; newInquiries: number }) {
  const path = usePathname()
  const nav = useRef<HTMLElement>(null)
  // The mobile menu is a native popover; close it after navigating.
  useEffect(() => {
    if (nav.current?.matches(':popover-open')) nav.current.hidePopover()
  }, [path])

  return (
    <>
      <div className="a-topbar tone-dark">
        <Link href="/admin" className="a-brand"><span>EVAC</span> Admin</Link>
        <button type="button" className="a-icon-btn" popoverTarget="a-nav" aria-label="Open menu"><Menu /></button>
      </div>
      <nav id="a-nav" ref={nav} popover="auto" className="a-sidebar tone-dark" aria-label="Admin">
        <Link href="/admin" className="a-brand a-brand--side"><span>EVAC</span> Admin</Link>
        {NAV.map(g => (
          <div key={g.group} className="a-nav-group">
            {g.group && <p className="a-nav-title">{g.group}</p>}
            <ul>
              {g.items.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} aria-current={active(path, href) ? 'page' : undefined}>
                    <Icon aria-hidden="true" />
                    {label}
                    {href === '/admin/inquiries' && newInquiries > 0 && <span className="a-count" aria-label={`${newInquiries} new`}>{newInquiries}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="a-nav-foot">
          <a href="/" target="_blank" rel="noopener"><ExternalLink aria-hidden="true" /> View website</a>
          <span className="a-nav-user" title={email}><FileText aria-hidden="true" /> {email}</span>
          <form action={signOut}>
            <button type="submit"><LogOut aria-hidden="true" /> Log out</button>
          </form>
        </div>
      </nav>
    </>
  )
}
