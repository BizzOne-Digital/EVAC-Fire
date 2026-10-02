import type { Metadata, Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'
import Script from 'next/script'
import { introScript } from '@/components/splash'
import { siteUrl } from '@/lib/site'
import './globals.css'

const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' })
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = { metadataBase: new URL(siteUrl()) }

export const viewport: Viewport = {
  themeColor: '#0b1117',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* Placed in <head> by Next before hydration, so the intro decision happens before first paint. */}
        <Script id="intro" strategy="beforeInteractive">{introScript}</Script>
        {children}
      </body>
    </html>
  )
}
