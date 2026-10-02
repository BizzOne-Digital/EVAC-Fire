'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Upload } from 'lucide-react'
import { listMedia, uploadMedia } from '@/app/admin/(panel)/media/actions'
import { toast } from './toast'

export type PickedMedia = { id: string; url: string; filename: string; alt: string; width: number | null; height: number | null }

export const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

/** Builds the upload FormData, adding each image's pixel size (read in the browser). */
export async function uploadForm(files: FileList | File[]) {
  const fd = new FormData()
  for (const [i, file] of [...files].entries()) {
    fd.append('file', file)
    const bmp = await createImageBitmap(file).catch(() => null)
    fd.append(`size.${i}`, bmp ? `${bmp.width}x${bmp.height}` : '')
    bmp?.close()
  }
  return fd
}

export function MediaPicker({ onPick, onClose }: { onPick: (m: PickedMedia) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [items, setItems] = useState<PickedMedia[] | null>(null)
  const [q, setQ] = useState('')
  const [uploading, start] = useTransition()

  useEffect(() => {
    dialog.current?.showModal()
    listMedia().then(setItems).catch(() => setItems([]))
  }, [])

  const upload = (files: FileList | null) =>
    files?.length &&
    start(async () => {
      const r = await uploadMedia(await uploadForm(files))
      if (!r.ok) return toast(r.message ?? 'Upload failed.', 'error')
      toast(r.message ?? 'Uploaded.')
      setItems(list => [...r.items, ...(list ?? [])])
    })

  const shown = (items ?? []).filter(m => !q || `${m.filename} ${m.alt}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <dialog ref={dialog} className="a-dialog a-dialog--wide" aria-label="Media library" onClose={onClose}>
      <div className="a-dialog-head">
        <h2>Choose an image</h2>
        <button type="button" className="a-btn a-btn--quiet" onClick={() => dialog.current?.close()}>Close</button>
      </div>
      <div className="a-toolbar">
        <input type="search" className="a-search" placeholder="Search images" value={q} onChange={e => setQ(e.target.value)} aria-label="Search images" />
        <label className="a-btn a-btn--primary a-upload">
          <Upload aria-hidden="true" /> {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" accept={ACCEPT} multiple className="sr-only" disabled={uploading} onChange={e => upload(e.target.files)} />
        </label>
      </div>
      {items === null ? (
        <p className="a-muted">Loading images…</p>
      ) : shown.length === 0 ? (
        <p className="a-muted">No images found. Upload one to get started.</p>
      ) : (
        <ul className="a-media-grid">
          {shown.map(m => (
            <li key={m.id}>
              <button type="button" className="a-media-tile" onClick={() => onPick(m)}>
                <img src={m.url} alt="" loading="lazy" />
                <span>{m.filename}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </dialog>
  )
}
