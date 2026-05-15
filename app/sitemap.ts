import type { MetadataRoute } from 'next'
import { getAllArticleMeta } from '@/lib/mdx'

const BASE = 'https://vibagen.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticleMeta()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/showcase`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/showcase/smart-factory`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/showcase/tmk-next-migration`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/showcase/autocar-care`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/autocar`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/autocar/features`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/autocar/faq`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/autocar/tutorial`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/expertise`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/knowledge`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/hire-us`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE}/knowledge/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: article.featured ? 0.9 : 0.7,
  }))

  return [...staticPages, ...articlePages]
}
