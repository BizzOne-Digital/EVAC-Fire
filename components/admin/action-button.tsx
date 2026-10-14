'use client'

import { useRef, useTransition, type ReactNode } from 'react'
import { toast } from './toast'

export type ActionResult = { ok: boolean; message?: string } | void

/**
 * Runs a bound server action (publish, reorder, delete…) and reports the result as a toast.
 * With `confirm`, a native dialog asks first; Escape or Cancel aborts.
 */
export function ActionButton({ action, children, confirm, danger, className, label }: { action: () => Promise<ActionResult>; children: ReactNode; confirm?: string; danger?: boolean; className?: string; label?: string }) {
  const [pending, start] = useTransition()
  const dialog = useRef<HTMLDialogElement>(null)
  const run = () =>
    start(async () => {
      try {
        const r = await action()
        if (r?.message) toast(r.message, r.ok ? 'ok' : 'error')
      } catch (e) {
        // redirect() inside an action surfaces as a thrown navigation signal; let Next handle it.
        if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e
        toast('Something went wrong. Please try again.', 'error')
      }
    })

  return (
    <>
      <button type="button" className={className ?? `a-btn ${danger ? 'a-btn--danger' : ''}`} disabled={pending} aria-label={label} onClick={() => (confirm ? dialog.current?.showModal() : run())}>
        {children}
      </button>
      {confirm && (
        <dialog ref={dialog} className="a-dialog" aria-label="Confirm">
          <p>{confirm}</p>
          <div className="a-dialog-actions">
            <button type="button" className="a-btn" onClick={() => dialog.current?.close()} autoFocus>Cancel</button>
            <button type="button" className={`a-btn ${danger ? 'a-btn--danger' : 'a-btn--primary'}`} onClick={() => { dialog.current?.close(); run() }}>
              {danger ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}
