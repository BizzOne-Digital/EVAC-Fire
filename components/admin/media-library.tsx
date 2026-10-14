'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Upload } from 'lucide-react'
import { deleteMedia, replaceMedia, updateAlt, uploadMedia } from '@/app/admin/(panel)/media/actions'
import { ActionButton } from './action-button'
import { ACCEPT, uploadForm, type PickedMedia } from './media-picker'
import { toast } from './toast'

type Item = PickedMedia & { uploaded: boolean; size: number }

export function MediaLibrary({ items }: { items: Item[] }) {
  const router = useRouter()
  const [busy, start] = useTransition()
  const [q, setQ] = useState('')

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      const r = await fn()
      if (r.message) toast(r.message, r.ok ? 'ok' : 'error')
      if (r.ok) router.refresh()
    })

  const shown = items.filter(m => !q || `${m.filename} ${m.alt}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <div className="a-toolbar">
        <input type="search" className="a-search" placeholder="Search by file name or alt text" value={q} onChange={e => setQ(e.target.value)} aria-label="Search media" />
        <label className="a-btn a-btn--primary a-upload">
          <Upload aria-hidden="true" /> {busy ? 'Working…' : 'Upload images'}
          <input type="file" accept={ACCEPT} multiple className="sr-only" disabled={busy} onChange={async e => { const f = e.target.files; if (f?.length) { const fd = await uploadForm(f); run(() => uploadMedia(fd)) } e.target.value = '' }} />
        </label>
      </div>
      <p className="a-muted">JPEG, PNG, WebP, GIF or AVIF, up to 4 MB each. Replacing an image updates it everywhere it is used.</p>
      {shown.length === 0 ? (
        <div className="a-empty"><p className="a-empty-title">{q ? 'No images match your search.' : 'No images yet.'}</p></div>
      ) : (
        <ul className="a-media-grid a-media-grid--lib">
          {shown.map(m => (
            <li key={m.id} className="a-media-card">
              <a href={m.url} target="_blank" rel="noopener" className="a-media-thumb"><img src={m.url} alt="" loading="lazy" /></a>
              <div className="a-media-meta">
                <span className="a-strong" title={m.filename}>{m.filename}</span>
                <span className="a-sub">{m.width && m.height ? `${m.width}×${m.height}` : 'Size unknown'}{m.uploaded ? ` · ${(m.size / 1024).toFixed(0)} KB` : ' · built-in'}</span>
                <form className="a-alt" onSubmit={e => { e.preventDefault(); const alt = String(new FormData(e.currentTarget).get('alt')); run(() => updateAlt(m.id, alt)) }}>
                  <label className="sr-only" htmlFor={`alt-${m.id}`}>Alt text for {m.filename}</label>
                  <input id={`alt-${m.id}`} name="alt" defaultValue={m.alt} placeholder="Default alt text" maxLength={300} />
                  <button type="submit" className="a-btn a-btn--quiet">Save</button>
                </form>
                <div className="a-inline">
                  <button type="button" className="a-btn" onClick={() => navigator.clipboard.writeText(m.url).then(() => toast('Image URL copied.'))}>Copy URL</button>
                  <label className="a-btn">
                    Replace
                    <input type="file" accept={ACCEPT} className="sr-only" disabled={busy} onChange={async e => { const f = e.target.files; if (f?.length) { const fd = await uploadForm([f[0]]); run(() => replaceMedia(m.id, fd)) } e.target.value = '' }} />
                  </label>
                  <ActionButton danger action={async () => { const r = await deleteMedia(m.id); if (r.ok) router.refresh(); return r }} confirm={`Delete ${m.filename}? Images still used on the website cannot be deleted.`}>Delete</ActionButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
