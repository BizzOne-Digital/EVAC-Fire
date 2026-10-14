'use client'

import { useEffect, useState } from 'react'

type Toast = { id: number; text: string; tone: 'ok' | 'error' }

export function toast(text: string, tone: Toast['tone'] = 'ok') {
  window.dispatchEvent(new CustomEvent('admin-toast', { detail: { text, tone } }))
}

/** Bottom-right notifications. Announced politely to screen readers. */
export function Toaster() {
  const [items, setItems] = useState<Toast[]>([])
  useEffect(() => {
    const on = (e: Event) => {
      const t = { id: Date.now() + Math.random(), ...(e as CustomEvent).detail }
      setItems(list => [...list, t])
      setTimeout(() => setItems(list => list.filter(x => x.id !== t.id)), 4500)
    }
    window.addEventListener('admin-toast', on)
    return () => window.removeEventListener('admin-toast', on)
  }, [])
  return (
    <div className="a-toasts" role="status" aria-live="polite">
      {items.map(t => <div key={t.id} className={`a-toast a-toast--${t.tone}`}>{t.text}</div>)}
    </div>
  )
}
