'use client'

import IframeViewer from './IframeViewer'

export default function PresentViewer() {
  return (
    <IframeViewer
      src="/autocar/present.html"
      title="AutoCar Care — Sales Presentation"
      label="Presentation"
      description="ข้อมูลนำเสนอระบบจัดการอู่ซ่อม + ล้างรถ ครบวงจร — ปัญหา ฟีเจอร์ ราคา วิธีเริ่มต้น"
    />
  )
}
