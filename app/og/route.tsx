import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'VIBAGEN — Crafting Ideas into Real Products'
  const subtitle = searchParams.get('sub') ?? 'Product Engineering Studio'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #011937 0%, #0d2749 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Orange glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,108,1,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', marginBottom: 'auto' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            VIBAGEN
          </span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          <div
            style={{
              fontSize: title.length > 50 ? '38px' : '48px',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1.2',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.55)',
              fontWeight: '400',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ color: '#ff6c01', fontSize: '16px', fontWeight: '600' }}>
            vibagen.com
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
            Crafting Ideas into Real Products
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
