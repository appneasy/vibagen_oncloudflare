import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ArticleMeta {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  readTime: number
  featured?: boolean
  keywords?: string[]
  ogImage?: string
  author?: string
  authorTitle?: string
}

export interface Article extends ArticleMeta {
  content: string
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

/** Get all article metadata (no content — fast for list pages) */
export function getAllArticleMeta(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const filePath = path.join(ARTICLES_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(raw)
      const slug = filename.replace(/\.mdx$/, '')
      return { slug, ...data } as ArticleMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Get all article slugs for generateStaticParams */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/** Get single article with content */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { slug, ...data, content } as Article
}
