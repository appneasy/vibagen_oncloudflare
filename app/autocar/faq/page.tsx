import type { Metadata } from 'next'
import FaqViewer from '@/components/autocar/FaqViewer'

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย — AutoCar Care",
  description: "คำตอบสำหรับทุกคำถามเกี่ยวกับ AutoCar Care — ค่าระบบ Hosting Maintenance Customization",
  alternates: { canonical: "https://vibagen.com/autocar/faq" },
  keywords: ["autocar care faq", "คำถามระบบอู่ซ่อมรถ", "autocar pricing", "perpetual license", "hosting"],
  openGraph: {
    title: "คำถามที่พบบ่อย — AutoCar Care",
    description: "คำตอบสำหรับทุกคำถามเกี่ยวกับ AutoCar Care — ค่าระบบ Hosting Maintenance Customization",
    url: "https://vibagen.com/autocar/faq",
    type: "website",
  },
}

export default function FaqPage() {
  return <FaqViewer />
}
