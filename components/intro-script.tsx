'use client'

import { introScript } from './splash'

/**
 * Inline head script. It executes from the server HTML before first paint; when React renders it
 * in the browser it never runs, so mark it as a data block there to skip React's script-tag warning.
 */
export function IntroScript() {
  return (
    <script
      id="intro"
      type={typeof window === 'undefined' ? undefined : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: introScript }}
    />
  )
}
