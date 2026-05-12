import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  // Support MDX files as pages
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  images: {
    // Allow Cloudflare R2 assets domain
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

export default withMDX(nextConfig)
