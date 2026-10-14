import { NextResponse, type NextRequest } from 'next/server'

// Fast redirect for signed-out visitors. Not the security boundary: pages and actions verify the session server-side.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname !== '/admin/login' && !request.cookies.has('evac_admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
