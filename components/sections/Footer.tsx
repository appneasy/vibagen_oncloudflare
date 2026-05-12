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
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/vlogo.png"
                alt="VIBAGEN"
                width={56}
                height={56}
                className="h-14 w-auto"
              />
              <span className="font-[--font-logo] text-2xl text-white tracking-wide">
                VIBAGEN
              </span>
            </div>
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
          <p className="text-white/25 text-xs">
            Built with Next.js + Cloudflare Pages — deployed at edge
          </p>
        </div>
      </div>
      </div>
    </footer>
  )
}
