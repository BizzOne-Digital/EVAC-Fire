/** @type {import('next').NextConfig} */
const nextConfig = {
  // Media uploads go through server actions; Vercel caps request bodies at 4.5 MB (files are limited to 4 MB).
  experimental: { serverActions: { bodySizeLimit: '4.5mb' } },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/difmil8wj/**' },
    ],
  },
}

export default nextConfig
