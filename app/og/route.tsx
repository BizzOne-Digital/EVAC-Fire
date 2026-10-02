import { ImageResponse } from 'next/og'
import { getDoc } from '@/lib/cms'
import { parseMarkup } from '@/lib/site'

export const revalidate = 3600

// Default social share image, built from Site Settings and the home hero headline.
export async function GET() {
  const [settings, home] = await Promise.all([getDoc('settings'), getDoc('home')])
  const lines = parseMarkup(home.hero.title)
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1117', color: '#f5f1e8', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#f45b24', fontSize: 24, letterSpacing: 6, textTransform: 'uppercase' }}>
          <div style={{ width: 48, height: 2, background: '#f45b24' }} />
          {settings.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 118, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>
          {lines.map((parts, i) => (
            <span key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>
              {parts.map((p, j) => <span key={j} style={p.em ? { color: '#f45b24' } : undefined}>{p.text}</span>)}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#a3adb5' }}>{home.hero.eyebrow || settings.tagline}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
