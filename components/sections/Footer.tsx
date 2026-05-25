import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'บริการ', href: '/services' },
  { label: 'ผลงาน', href: '/showcase' },
  { label: 'ความเชี่ยวชาญ', href: '/expertise' },
  { label: 'Knowledge Hub', href: '/knowledge' },
  { label: 'ติดต่อเรา', href: '/hire-us' },
]

const knowledgeLinks = [
  { label: 'Agentic AI', href: '/knowledge?category=agentic-ai' },
  { label: 'Vibecoding', href: '/knowledge?category=vibecoding' },
  { label: 'Business Digital', href: '/knowledge?category=business' },
  { label: 'Maintenance & Production', href: '/knowledge?category=industrial' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer aria-label="Footer">
      {/* Clean top border */}
      <div style={{ background: '#011937' }}>
        <div className="container">
          <div
            className="h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,108,1,0.3) 30%, rgba(255,108,1,0.3) 70%, transparent)' }}
          />
        </div>
      </div>
      <div style={{ background: '#011937' }}>
      <div className="container pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/images/logosquare.png"
              alt="VIBAGEN — Crafting Ideas into Real Products"
              width={200}
              height={200}
              className="h-36 w-auto mb-4"
              style={{ filter: 'brightness(1.15) contrast(1.05)' }}
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Product Engineering Studio — เปลี่ยนไอเดียและปัญหาธุรกิจให้กลายเป็น Software
              ที่ใช้งานได้จริง
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-[--font-heading] font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Pages
            </h3>
            <ul className="space-y-2.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge */}
          <div>
            <h3 className="font-[--font-heading] font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Knowledge Hub
            </h3>
            <ul className="space-y-2.5" role="list">
              {knowledgeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {year} VIBAGEN. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/vibagen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
              aria-label="VIBAGEN Facebook Page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <p className="text-white/25 text-xs">
              Built with Next.js + Cloudflare Pages — deployed at edge
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
