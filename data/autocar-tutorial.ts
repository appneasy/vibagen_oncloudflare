export interface TutorialStep {
  image: string
  title: string
  description: string
  highlight?: string
}

export interface TutorialTopic {
  id: string
  phase: number
  topicNumber: number
  title: string
  subtitle: string
  icon: string
  steps: TutorialStep[]
}

export const tutorialTopics: TutorialTopic[] = [
  {
    id: 'customer-flow',
    phase: 1,
    topicNumber: 1,
    title: 'รับรถเข้าซ่อม',
    subtitle: 'ดูวิธีที่ลูกค้าใช้งานแอป — ตั้งแต่จองคิวจนรับรถกลับ',
    icon: '🚗',
    steps: [
      {
        image: '/autocar/tutorial/01-home.png',
        title: 'หน้าหลัก',
        description:
          'ลูกค้าเปิดแอปผ่าน LINE เห็นเมนูบริการทั้งหมด เช่น เข้าซ่อม สถานะรถ ประวัติ',
      },
      {
        image: '/autocar/tutorial/02-repair-booking.png',
        title: 'จองคิวเข้าซ่อม',
        description:
          'กดปุ่ม "เข้าซ่อม" เลือกรถที่ต้องการส่งซ่อม เลือกประเภทบริการ',
      },
      {
        image: '/autocar/tutorial/03-repair-booking-scroll.png',
        title: 'เลือกวันเวลา',
        description:
          'เลื่อนลงเลือกวันเวลาที่สะดวก พิมพ์หมายเหตุเพิ่มเติม แล้วกดยืนยัน',
      },
      {
        image: '/autocar/tutorial/04-tracking-list.png',
        title: 'ติดตามสถานะรถ',
        description:
          'กดเมนู "สถานะรถ" ดูรายการงานซ่อมทั้งหมด เห็นสถานะแต่ละคัน',
      },
      {
        image: '/autocar/tutorial/05-tracking-detail.png',
        title: 'รายละเอียดงานซ่อม',
        description:
          'กดเข้าดูรายละเอียด เห็นขั้นตอนการซ่อม ช่างที่รับผิดชอบ',
      },
      {
        image: '/autocar/tutorial/06-tracking-detail-scroll.png',
        title: 'ความคืบหน้า',
        description:
          'เลื่อนดูความคืบหน้าทั้งหมด รายการอะไหล่ ค่าใช้จ่าย',
      },
      {
        image: '/autocar/tutorial/07-notifications.png',
        title: 'การแจ้งเตือน',
        description:
          'ระบบแจ้งเตือนอัตโนมัติทุกสถานะ ไม่ต้องโทรถาม',
        highlight: 'ลูกค้าได้รับแจ้งเตือนทันทีทุกครั้งที่สถานะเปลี่ยน — ลดสายโทรถามได้ถึง 70%',
      },
      {
        image: '/autocar/tutorial/08-history.png',
        title: 'ประวัติบริการ',
        description:
          'ดูประวัติซ่อมทุกครั้ง วันที่ รายการ ราคา ครบถ้วน',
      },
      {
        image: '/autocar/tutorial/09-after-service.png',
        title: 'ให้คะแนนหลังบริการ',
        description:
          'หลังรับรถ ลูกค้าให้คะแนนความพึงพอใจ ร้านเห็น feedback จริง',
        highlight: 'ร้านเห็น feedback จากลูกค้าทันที — นำไปปรับปรุงบริการได้จริง',
      },
      {
        image: '/autocar/tutorial/10-my-car.png',
        title: 'ข้อมูลรถของฉัน',
        description:
          'ดูข้อมูลรถ ระยะทาง ประวัติ รอบเปลี่ยนถ่าย ได้ตลอด',
      },
    ],
  },
]
