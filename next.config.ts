import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vibagen.com',
      },
    ],
    // Disable built-in optimizer for Cloudflare Pages compatibility
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
