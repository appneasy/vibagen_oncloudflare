import type { Metadata } from 'next'
import { Prompt, Sarabun, Prosto_One } from 'next/font/google'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────
const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
})

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['400', '500'],
  variable: '--font-sarabun',
  display: 'swap',
})

const prostoOne = Prosto_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-prosto',
  display: 'swap',
})

// ─── Default Metadata ─────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://vibagen.com'),
  title: {
    default: 'VIBAGEN — Crafting Ideas into Real Products',
    template: '%s | VIBAGEN',
  },
  description:
    'VIBAGEN คือ Product Engineering Studio ที่เปลี่ยนไอเดียและปัญหาธุรกิจให้กลายเป็น Software ที่ใช้งานได้จริง ด้วย Vibecoding และ Agentic AI',
  keywords: [
    'vibagen',
    'product engineering',
    'agentic ai',
    'business software',
    'next.js',
    'cloudflare',
    'สร้างระบบ',
    'software house ไทย',
    'vibecoding',
  ],
  authors: [{ name: 'Akkraphol', url: 'https://vibagen.com' }],
  creator: 'VIBAGEN',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://vibagen.com',
    siteName: 'VIBAGEN',
    title: 'VIBAGEN — Crafting Ideas into Real Products',
    description:
      'VIBAGEN คือ Product Engineering Studio ที่เปลี่ยนไอเดียและปัญหาธุรกิจให้กลายเป็น Software ที่ใช้งานได้จริง',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'VIBAGEN — Crafting Ideas into Real Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIBAGEN — Crafting Ideas into Real Products',
    description: 'Product Engineering Studio — สร้าง Software ที่ลูกค้าเป็นเจ้าของได้จริง',
    images: ['/images/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://vibagen.com',
  },
}

// ─── JSON-LD: Organization ────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VIBAGEN',
  url: 'https://vibagen.com',
  logo: 'https://vibagen.com/images/logo.svg',
  description: 'Product Engineering Studio — Crafting Ideas into Real Products',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'akkraphol@gmail.com',
    contactType: 'customer service',
    availableLanguage: ['Thai', 'English'],
  },
  sameAs: [],
}

// ─── Root Layout ──────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${prompt.variable} ${sarabun.variable} ${prostoOne.variable}`}>
      <head>
        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Cloudflare Web Analytics — add token in env */}
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body
        style={{
          fontFamily: 'var(--font-sarabun), var(--font-body)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
