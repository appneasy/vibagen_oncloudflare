'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // POST increments, then returns new count
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === 'number') setViews(data.views)
      })
      .catch(() => {
        // Silently fail — view count is non-critical
      })
  }, [slug])

  if (views === null) return null

  return (
    <span className="text-white/30 text-sm">
      {views.toLocaleString('th-TH')} ครั้งที่อ่าน
    </span>
  )
}
