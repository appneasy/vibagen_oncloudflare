import type { Metadata } from 'next'
import PresentViewer from '@/components/autocar/PresentViewer'

export const metadata: Metadata = {
  title: 'AutoCar Care — ข้อมูลนำเสนอ',
  description:
    'โปรแกรมอู่ซ่อมรถ + โปรแกรมคาร์แคร์ ครบวงจร — ระบบจัดการอู่ซ่อมรถ ล้างรถ จองคิว ติดตามงาน สต็อกอะไหล่ LINE LIFF Perpetual License เป็นเจ้าของ 100%',
  alternates: { canonical: 'https://vibagen.com/autocar' },
  keywords: [
    'autocar care',
    'ระบบอู่ซ่อมรถ',
    'โปรแกรมอู่ซ่อมรถ',
    'โปรแกรมคาร์แคร์',
    'โปรแกรมร้านล้างรถ',
    'โปรแกรมบริหารอู่ซ่อมรถ',
    'แอพอู่ซ่อมรถ',
    'โปรแกรมศูนย์บริการรถยนต์',
    'garage management system',
    'car care management',
    'perpetual license',
    'line liff',
    'ระบบคาร์แคร์',
  ],
  openGraph: {
    title: 'AutoCar Care — ระบบจัดการอู่ซ่อม + ล้างรถ ครบวงจร',
    description:
      'Perpetual License — เป็นเจ้าของระบบ 100% ซ่อม + ล้าง + Loyalty ในระบบเดียว',
    url: 'https://vibagen.com/autocar',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AutoCar Care',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'ระบบจัดการอู่ซ่อมรถ + ล้างรถ ครบวงจร — Perpetual License',
  offers: {
    '@type': 'Offer',
    price: '29000',
    priceCurrency: 'THB',
    description: 'One-time perpetual license',
  },
  author: {
    '@type': 'Organization',
    name: 'VIBAGEN',
    url: 'https://vibagen.com',
  },
}

export default function AutoCarPresentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PresentViewer />
    </>
  )
}
