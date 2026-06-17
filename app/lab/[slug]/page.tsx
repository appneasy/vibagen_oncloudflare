import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLabBySlug, getAllLabSlugs } from '@/lib/lab'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import StackWizard from '@/components/lab/StackWizard'

export function generateStaticParams() {
  return getAllLabSlugs().map((slug) => ({ slug }))
}

// ─── Dynamic Metadata ──────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = getLabBySlug(slug)
  if (!note) return {}

  return {
    title: note.title,
    description: note.excerpt,
    keywords: note.keywords,
    openGraph: {
      type: 'article',
      locale: 'th_TH',
      title: note.title,
      description: note.excerpt,
      publishedTime: note.date,
      authors: [note.author ?? 'VIBAGEN'],
      images: [{ url: note.ogImage ?? '/images/og-default.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://vibagen.com/lab/${slug}`,
    },
  }
}

// ─── JSON-LD Article Schema ────────────────────────────────
function LabSchema({ note }: { note: ReturnType<typeof getLabBySlug> }) {
  if (!note) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    author: {
      '@type': 'Person',
      name: note.author ?? 'Akkraphol',
      url: 'https://vibagen.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VIBAGEN',
      logo: { '@type': 'ImageObject', url: 'https://vibagen.com/images/logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://vibagen.com/lab/${note.slug}` },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Page ──────────────────────────────────────────────────
export default async function LabNotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const note = getLabBySlug(slug)
  if (!note) notFound()

  const patternColor = note.pattern === 'P1' ? '#f59e0b' : '#22d3ee'

  return (
    <>
      <Navbar />
      <LabSchema note={note} />

      <main className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        {/* Hero zone */}
        <div className="relative z-10 pt-24 pb-12">
          <div className="container">
            {/* Back link */}
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors mb-8"
            >
              ← AI Lab
            </Link>

            {/* Article header */}
            <div className="max-w-3xl mx-auto">
              {/* Pattern badge + read time */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full border"
                  style={{
                    color: patternColor,
                    background: `${patternColor}1a`,
                    borderColor: `${patternColor}40`,
                  }}
                >
                  {note.pattern} · {note.patternName}
                </span>
                <span className="text-white/30 text-sm">{note.readTime} นาทีอ่าน</span>
                {note.promptCount > 0 && (
                  <span className="text-white/30 text-sm">{note.promptCount} prompts</span>
                )}
              </div>

              {/* Title */}
              <h1
                className="font-[--font-heading] font-bold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
              >
                {note.title}
              </h1>

              {/* Excerpt */}
              <p className="text-white/70 text-xl leading-relaxed mb-6">{note.excerpt}</p>

              {/* Author + date */}
              <div className="flex items-center gap-4 pb-8 border-b border-white/[0.08]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: '#ff6c01', color: '#fff' }}
                >
                  {note.author?.charAt(0) ?? 'A'}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{note.author ?? 'Akkraphol'}</p>
                  <p className="text-white/40 text-xs">{note.authorTitle ?? 'VIBAGEN'}</p>
                </div>
                <span className="ml-auto text-white/30 text-sm">
                  {new Date(note.date).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>

              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content zone — stays dark */}
        <div className="relative z-10 pb-20">
          <div className="container">
            <article
              className="max-w-3xl mx-auto pt-12"
              style={{
                color: 'rgba(255,255,255,0.70)',
                lineHeight: '1.8',
                fontFamily: 'var(--font-sarabun, var(--font-body))',
              }}
              dangerouslySetInnerHTML={{ __html: labMarkdownToHtml(note.content) }}
            />

            {/* Interactive tool */}
            {note.hasInteractive && note.slug === 'p1-stack-decision' && (
              <div className="max-w-3xl mx-auto mt-12">
                <StackWizard />
              </div>
            )}

            {/* CTA block */}
            <div
              className="max-w-3xl mx-auto mt-16 rounded-2xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,108,1,0.06) 0%, rgba(20,20,25,0.6) 100%)',
                border: '1px solid rgba(255,108,1,0.20)',
              }}
            >
              <p className="text-white text-xl font-[--font-heading] font-semibold mb-2">
                อยากลองใช้ AI ในองค์กรของคุณ?
              </p>
              <p className="text-white/60 mb-6">
                ปรึกษาเราได้ฟรี — ไม่ขาย แค่ช่วยให้เห็นภาพก่อน
              </p>
              <Link
                href="/hire-us"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6c01] text-white font-semibold rounded-xl hover:bg-[#d54e01] transition-colors"
              >
                ปรึกษาฟรี →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

// ─── Custom blocks parser ──────────────────────────────────

function parsePromptBlock(content: string): string {
  const trimmed = content.trim()
  const escaped = trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin:24px 0;overflow:hidden">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.06)">
    <span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.50);text-transform:uppercase;letter-spacing:0.5px">Copy-ready Prompt</span>
    <button onclick="(function(btn){var t=btn.closest('[data-prompt]');var txt=t?t.getAttribute('data-prompt'):'';navigator.clipboard.writeText(txt).then(function(){btn.textContent='✓ Copied!';btn.style.color='#22c55e';btn.style.background='rgba(34,197,94,0.15)';setTimeout(function(){btn.textContent='Copy';btn.style.color='#ff6c01';btn.style.background='rgba(255,108,1,0.12)'},2000)})})(this)" style="font-size:12px;font-weight:600;padding:4px 12px;border-radius:8px;border:none;cursor:pointer;background:rgba(255,108,1,0.12);color:#ff6c01">Copy</button>
  </div>
  <pre data-prompt="${trimmed.replace(/"/g, '&quot;')}" style="padding:16px 20px;margin:0;overflow-x:auto;white-space:pre-wrap;font-family:'Fira Code',Consolas,Monaco,monospace;font-size:13px;line-height:1.8;color:rgba(255,255,255,0.80)">${escaped}</pre>
</div>`
}

function parseInsightBlock(attrs: string, content: string): string {
  const numMatch = attrs.match(/number=(\d+)/)
  const titleMatch = attrs.match(/title="([^"]+)"/)
  const number = numMatch ? numMatch[1] : '1'
  const title = titleMatch ? titleMatch[1] : ''
  const description = content.trim()

  return `<div style="display:flex;gap:16px;border-radius:12px;padding:20px;margin:16px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-left:3px solid #ff6c01">
  <div style="flex-shrink:0;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:rgba(255,108,1,0.15);color:#ff6c01">${number}</div>
  <div style="flex:1;min-width:0">
    <p style="font-weight:600;color:#fff;margin:0 0 4px 0">${title}</p>
    <p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);margin:0">${description}</p>
  </div>
</div>`
}

function parseLessonBlock(attrs: string, content: string): string {
  const titleMatch = attrs.match(/title="([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : 'บทเรียน'

  return `<div style="border-radius:12px;padding:24px;margin:24px 0;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.20)">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <span style="font-size:18px">💡</span>
    <strong style="color:#fff;font-size:14px">${title}</strong>
  </div>
  <div style="font-size:14px;line-height:1.75;color:rgba(255,255,255,0.70)">${content.trim()}</div>
</div>`
}

function parseDownloadBlock(attrs: string, content: string): string {
  const titleMatch = attrs.match(/title="([^"]+)"/)
  const subtitleMatch = attrs.match(/subtitle="([^"]+)"/)
  const featuresMatch = attrs.match(/features="([^"]+)"/)
  const linkMatch = attrs.match(/link="([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : ''
  const subtitle = subtitleMatch ? subtitleMatch[1] : ''
  const features = featuresMatch ? featuresMatch[1] : ''
  const link = linkMatch ? linkMatch[1] : ''
  const description = content.trim().replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')

  const btnHtml = link
    ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#f59e0b;color:#000;font-weight:700;font-family:'Fira Code',Consolas,monospace;font-size:12px;letter-spacing:.08em;padding:10px 28px;border-radius:8px;text-decoration:none;margin-bottom:14px;transition:background 0.15s" onmouseover="this.style.background='#fbbf24'" onmouseout="this.style.background='#f59e0b'">⚙️ เปิด Dashboard</a>`
    : ''

  return `<div style="border-radius:12px;padding:24px;margin:24px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-top:2px solid #f59e0b;text-align:center">
  <div style="font-size:24px;margin-bottom:8px">📥</div>
  <div style="font-weight:700;font-size:1rem;color:#fff;margin-bottom:6px">${title}</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.75;margin-bottom:14px">${description}</div>
  ${btnHtml}
  <div style="font-size:13px;color:#f59e0b;margin-bottom:12px">${subtitle}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
    ${features.split(',').map(f => `<span style="font-size:11px;font-family:'Fira Code',Consolas,monospace;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);padding:3px 10px;border-radius:4px;color:rgba(255,255,255,0.50)">${f.trim()}</span>`).join('')}
  </div>
</div>`
}

function parseCtaBlock(attrs: string, content: string): string {
  const titleMatch = attrs.match(/title="([^"]+)"/)
  const accentMatch = attrs.match(/accent="([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : ''
  const accent = accentMatch ? accentMatch[1] : 'green'
  const description = content.trim().replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')

  const isAmber = accent === 'amber'
  const bg = isAmber ? 'rgba(245,158,11,0.06)' : 'rgba(74,222,128,0.06)'
  const border = isAmber ? 'rgba(245,158,11,0.25)' : 'rgba(74,222,128,0.25)'

  return `<div style="border-radius:12px;padding:24px;margin:24px 0;background:${bg};border:1.5px solid ${border};text-align:center">
  <div style="font-weight:700;font-size:1rem;color:#fff;margin-bottom:8px">${title}</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.75;margin-bottom:14px">${description}</div>
</div>`
}

function parseTeaserBlock(attrs: string, content: string): string {
  const titleMatch = attrs.match(/title="([^"]+)"/)
  const labelMatch = attrs.match(/label="([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : ''
  const label = labelMatch ? labelMatch[1] : ''
  const description = content.trim().replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')

  return `<div style="border-radius:0 12px 12px 0;padding:20px 24px;margin:24px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-left:3px solid #f59e0b">
  <div style="font-family:'Fira Code',Consolas,monospace;font-size:10px;color:#f59e0b;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px">${label}</div>
  <div style="font-weight:700;font-size:1rem;color:#fff;margin-bottom:8px">${title}</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.60);line-height:1.75">${description}</div>
</div>`
}

function extractCustomBlocks(md: string): { md: string; blocks: string[] } {
  const blocks: string[] = []

  // :::prompt ... :::
  md = md.replace(/:::prompt\n([\s\S]*?):::/g, (_match, content: string) => {
    blocks.push(parsePromptBlock(content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  // :::insight{...} ... :::
  md = md.replace(/:::insight(\{[^}]*\})\n([\s\S]*?):::/g, (_match, attrs: string, content: string) => {
    blocks.push(parseInsightBlock(attrs.slice(1, -1), content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  // :::lesson{...} ... :::
  md = md.replace(/:::lesson(\{[^}]*\})\n([\s\S]*?):::/g, (_match, attrs: string, content: string) => {
    blocks.push(parseLessonBlock(attrs.slice(1, -1), content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  // :::download{...} ... :::
  md = md.replace(/:::download(\{[^}]*\})\n([\s\S]*?):::/g, (_match, attrs: string, content: string) => {
    blocks.push(parseDownloadBlock(attrs.slice(1, -1), content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  // :::cta{...} ... :::
  md = md.replace(/:::cta(\{[^}]*\})\n([\s\S]*?):::/g, (_match, attrs: string, content: string) => {
    blocks.push(parseCtaBlock(attrs.slice(1, -1), content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  // :::teaser{...} ... :::
  md = md.replace(/:::teaser(\{[^}]*\})\n([\s\S]*?):::/g, (_match, attrs: string, content: string) => {
    blocks.push(parseTeaserBlock(attrs.slice(1, -1), content))
    return `<!--customblock:${blocks.length - 1}-->`
  })

  return { md, blocks }
}

// ─── Dark-theme table parser ───────────────────────────────
function parseLabTables(md: string): string {
  const tableRegex = /^(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/gm
  return md.replace(tableRegex, (_match, headerLine: string, _sep: string, bodyBlock: string) => {
    const parseRow = (row: string) =>
      row.split('|').slice(1, -1).map((cell) => cell.trim())

    const headers = parseRow(headerLine)
    const rows = bodyBlock.trim().split('\n').map(parseRow)

    const ths = headers
      .map(
        (h) =>
          `<th style="padding:10px 14px;text-align:left;font-size:13px;font-weight:600;color:#fff;white-space:nowrap">${h}</th>`,
      )
      .join('')
    const trs = rows
      .map(
        (cells) =>
          '<tr>' +
          cells
            .map(
              (c) =>
                `<td style="padding:10px 14px;font-size:13px;color:rgba(255,255,255,0.70);border-bottom:1px solid rgba(255,255,255,0.06)">${c}</td>`,
            )
            .join('') +
          '</tr>',
      )
      .join('')

    return `<div style="overflow-x:auto;margin:16px 0"><table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden"><thead><tr style="background:#1a1a24">${ths}</tr></thead><tbody>${trs}</tbody></table></div>`
  })
}

// ─── Main dark-theme markdown → HTML ──────────────────────
function labMarkdownToHtml(md: string): string {
  md = md.replace(/\r\n/g, '\n')

  // Extract custom blocks first
  const { md: mdAfterCustom, blocks } = extractCustomBlocks(md)
  md = mdAfterCustom

  // Extract code blocks
  const codeBlocks: string[] = []
  md = md.replace(/```(\w*)\n([\s\S]*?)```/gm, (_match, lang: string, code: string) => {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const html = `<div style="margin:20px 0;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)"><div style="background:#111118;padding:8px 16px;font-size:11px;color:#ff6c01;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">${lang || 'terminal'}</div><pre style="background:#161620;color:#e2e8f0;padding:20px 24px;margin:0;overflow-x:auto;font-size:13px;line-height:1.8;font-family:'Fira Code',Consolas,Monaco,monospace"><code>${escaped}</code></pre></div>`
    codeBlocks.push(html)
    return `<!--codeblock:${codeBlocks.length - 1}-->`
  })

  // Parse tables
  let html = parseLabTables(md)

  html = html
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0" />')
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-family:var(--font-heading);font-weight:700;color:#fff;font-size:1.5rem;margin-top:40px;margin-bottom:16px">$1</h2>',
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-family:var(--font-heading);font-weight:600;color:#ff6c01;font-size:1.25rem;margin-top:32px;margin-bottom:12px">$1</h3>',
    )
    .replace(
      /^\> (.+)$/gm,
      '<blockquote style="border-left:4px solid #ff6c01;padding-left:20px;margin:24px 0;color:rgba(255,255,255,0.60);font-style:italic">$1</blockquote>',
    )
    .replace(
      /^\*\*(\d+)\. (.+)\*\*$/gm,
      '<p style="font-weight:600;color:#fff;margin-top:16px">$1. $2</p>',
    )
    .replace(
      /^- (.+)$/gm,
      '<li style="margin-left:16px;color:rgba(255,255,255,0.70)">$1</li>',
    )
    .replace(
      /(<li.*<\/li>\n?)+/g,
      '<ul style="list-style:disc;padding-left:8px;space-y:4px;margin:16px 0">$&</ul>',
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>')
    .replace(/^(?!<[h|b|u|l|p|i|d|hr]|<!--).+$/gm, (line) =>
      line.trim() ? `<p style="margin-bottom:16px">${line}</p>` : '',
    )

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    html = html.replace(`<!--codeblock:${i}-->`, block)
  })

  // Restore custom blocks
  blocks.forEach((block, i) => {
    html = html.replace(`<!--customblock:${i}-->`, block)
  })

  return html
}
