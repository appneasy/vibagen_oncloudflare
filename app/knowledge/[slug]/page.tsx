import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/mdx'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ViewCounter from '@/components/ui/ViewCounter'

// ─── Static Generation ─────────────────────────────────────
export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

// ─── Dynamic Metadata ──────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    openGraph: {
      type: 'article',
      locale: 'th_TH',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      authors: [article.author ?? 'VIBAGEN'],
      images: [{ url: article.ogImage ?? '/images/og-default.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://vibagen.com/knowledge/${slug}`,
    },
  }
}

// ─── JSON-LD Article Schema ────────────────────────────────
function ArticleSchema({ article }: { article: ReturnType<typeof getArticleBySlug> }) {
  if (!article) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author ?? 'Akkraphol',
      url: 'https://vibagen.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VIBAGEN',
      logo: { '@type': 'ImageObject', url: 'https://vibagen.com/images/logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://vibagen.com/knowledge/${article.slug}` },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Page ──────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <>
      <Navbar />
      <ArticleSchema article={article} />

      <main className="min-h-screen">
        {/* Hero zone — navy */}
        <div style={{ background: '#011937' }} className="pt-24 pb-12">
          <div className="container">
            {/* Back link */}
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors mb-8"
            >
              ← Knowledge Hub
            </Link>

            {/* Article header */}
            <div className="max-w-3xl mx-auto">
              {/* Category + read time */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ff6c01]/10 text-[#ff6c01] border border-[#ff6c01]/20">
                  {article.category}
                </span>
                <span className="text-white/30 text-sm">{article.readTime} นาทีอ่าน</span>
                <ViewCounter slug={slug} />
              </div>

              {/* Title */}
              <h1
                className="font-[--font-heading] font-bold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
              >
                {article.title}
              </h1>

              {/* Excerpt / lead */}
              <p className="text-white/70 text-xl leading-relaxed mb-6">{article.excerpt}</p>

              {/* Author + date */}
              <div className="flex items-center gap-4 pb-8 border-b border-white/[0.08]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: '#ff6c01', color: '#fff' }}
                >
                  {article.author?.charAt(0) ?? 'A'}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{article.author ?? 'Akkraphol'}</p>
                  <p className="text-white/40 text-xs">{article.authorTitle ?? 'VIBAGEN'}</p>
                </div>
                <span className="ml-auto text-white/30 text-sm">
                  {new Date(article.date).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transition gradient */}
        <div style={{ background: 'linear-gradient(180deg, #011937, #fafaf9)' }} className="h-20" />

        {/* Content zone — light */}
        <div style={{ background: '#fafaf9' }} className="pb-20">
          <div className="container">
            {/* Article body */}
            <article
              className="max-w-3xl mx-auto prose-vibagen pt-12"
              style={{
                color: '#2d3748',
                lineHeight: '1.8',
                fontFamily: 'var(--font-sarabun, var(--font-body))',
              }}
              dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(article.content) }}
            />

            {/* CTA block */}
            <div
              className="max-w-3xl mx-auto mt-16 rounded-2xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(13,39,73,0.05) 0%, rgba(255,108,1,0.08) 100%)',
                border: '1px solid rgba(255,108,1,0.2)',
              }}
            >
              <p className="text-[#0d2749] text-xl font-[--font-heading] font-semibold mb-2">
                ถ้าคุณกำลังคิดจะ implement ระบบ
              </p>
              <p className="text-[#4a5568] mb-6">
                และไม่แน่ใจว่าองค์กรพร้อมแค่ไหน ปรึกษาเราได้ฟรี — ไม่ขาย แค่ช่วยให้เห็นภาพก่อน
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

/**
 * Minimal Markdown → HTML converter for article body.
 * Handles: h2/h3, bold, italic, blockquote, ul/li, hr, p.
 * For production, replace with remark/rehype pipeline.
 */
function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^---$/gm, '<hr class="border-[#e2e8f0] my-8" />')
    .replace(/^## (.+)$/gm, '<h2 class="font-heading font-bold text-[#0d2749] text-2xl mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="font-heading font-semibold text-[#ff6c01] text-xl mt-8 mb-3">$1</h3>')
    .replace(/^\> (.+)$/gm, '<blockquote class="border-l-4 border-[#ff6c01] pl-5 my-6 text-[#4a5568] italic">$1</blockquote>')
    .replace(/^\*\*(\d+)\. (.+)\*\*$/gm, '<p class="font-semibold text-[#0d2749] mt-4">$1. $2</p>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-[#4a5568]">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 my-4">$&</ul>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1a202c] font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^(?!<[h|b|u|l|p|i|hr]).+$/gm, (line) =>
      line.trim() ? `<p class="mb-4">${line}</p>` : '',
    )
}
