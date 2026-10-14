import { collections, oid } from '@/lib/db'

// Serves uploaded media. URLs are immutable: replacing an image creates a new URL (see admin media actions).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const _id = oid((await params).id)
  const file = _id && (await (await collections()).media.findOne({ _id, data: { $ne: null } }))
  if (!file?.data) return new Response('Not found', { status: 404 })
  return new Response(new Uint8Array(file.data.buffer), {
    headers: {
      'Content-Type': file.contentType,
      'Content-Length': String(file.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  })
}
