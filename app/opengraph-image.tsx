import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name}: ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1117', color: '#f5f1e8', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#f45b24', fontSize: 24, letterSpacing: 6, textTransform: 'uppercase' }}>
          <div style={{ width: 48, height: 2, background: '#f45b24' }} />
          {site.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 118, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>PLAN.</span>
          <span style={{ color: '#f45b24' }}>PREPARE.</span>
          <span>EVACUATE.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#a3adb5' }}>Fire safety plans · Fire drills · Fire safety training · Expert consultation</div>
      </div>
    ),
    size,
  )
}
