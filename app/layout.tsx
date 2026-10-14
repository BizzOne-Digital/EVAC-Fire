import type { Metadata, Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'
import { IntroScript } from '@/components/intro-script'
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
      <head>
        {/* Runs before first paint so the intro decision is made before the page shows. */}
        <IntroScript />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
