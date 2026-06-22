import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface LabNoteMeta {
  slug: string
  title: string
  pattern: string
  patternName: string
  project: string
  date: string
  excerpt: string
  readTime: number
  tags: string[]
  promptCount: number
  hasInteractive: boolean
  author?: string
  authorTitle?: string
  keywords?: string[]
  ogImage?: string
}

export interface LabNote extends LabNoteMeta {
  content: string
}

const LAB_DIR = path.join(process.cwd(), 'content', 'lab')

/** Get all lab note metadata (no content — fast for list pages) */
export function getAllLabMeta(): LabNoteMeta[] {
  if (!fs.existsSync(LAB_DIR)) return []

  const files = fs.readdirSync(LAB_DIR).filter((f) => f.endsWith('.mdx'))

  // ซ่อน P2 ไว้ก่อน — เนื้อหายังไม่สมบูรณ์
  const hiddenSlugs = ['p2-pdm-field-note']

  return files
    .map((filename) => {
      const filePath = path.join(LAB_DIR, filename)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(raw)
      const slug = filename.replace(/\.mdx$/, '')
      return { slug, ...data } as LabNoteMeta
    })
    .filter((note) => !hiddenSlugs.includes(note.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Get all lab slugs for generateStaticParams */
export function getAllLabSlugs(): string[] {
  if (!fs.existsSync(LAB_DIR)) return []
  return fs
    .readdirSync(LAB_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/** Get single lab note with content */
export function getLabBySlug(slug: string): LabNote | null {
  const filePath = path.join(LAB_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { slug, ...data, content } as LabNote
}
