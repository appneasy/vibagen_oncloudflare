export type StepViewport = 'admin' | 'customer'

export interface TutorialStep {
  image: string
  title: string
  description: string
  viewport: StepViewport
  highlight?: string
}

export interface TutorialTopic {
  id: string
  phase: number
  topicNumber: number
  title: string
  subtitle: string
  icon: string
  problem: string
  solution: string
  values: string[]
  customerNote?: string
  steps: TutorialStep[]
}

export const phases = [
  { phase: 1, title: 'เริ่มต้นใช้งาน', subtitle: 'ครอบคลุม 80% ของงานหลัก' },
  { phase: 2, title: 'บริการเสริม + บริหารร้าน', subtitle: 'เพิ่มประสิทธิภาพและรายได้' },
  { phase: 3, title: 'เพิ่มยอดขาย', subtitle: 'ดูแลลูกค้าให้กลับมา' },
  { phase: 4, title: 'เสถียรภาพ', subtitle: 'ดูแลตลอด 24/7' },
]

export const tutorialTopics: TutorialTopic[] = [
  {
    id: 'walkin-checkin',
    phase: 1,
    topicNumber: 1,
    title: 'รับรถเข้าซ่อม (Walk-in)',
    subtitle: 'สร้างใบงานทันที มีเลขอ้างอิง ค้นหาได้ ไม่มีใบงานหาย',
    icon: '🚗',
    problem: 'ลูกค้ามา 3 คันพร้อมกัน จดมือ กระดาษหาย ลืมจดอาการ ต้องโทรถามลูกค้าใหม่',
    solution: 'Admin เปิดหน้า "รับรถ" กรอกข้อมูล สร้างใบงานทันที มีเลขอ้างอิง ค้นหาได้',
    values: [
      'ไม่มีใบงานหาย — ข้อมูลอยู่ในระบบตลอด',
      'ค้นหาได้ทันที — พิมพ์ป้ายทะเบียน เจอรถทุกคัน',
      'มอบหมายช่างชัดเจน — ช่างรู้ว่าคันไหนเป็นของตัวเอง',
    ],
    customerNote: 'ลูกค้าได้รับแจ้งเตือนว่า "รถเข้ารับบริการแล้ว" ไม่ต้องโทรถาม',
    steps: [
      {
        image: '/autocar/tutorial/admin-checkin.png',
        title: 'ฟอร์มรับรถใหม่',
        description: 'Admin กรอก ทะเบียน เบอร์โทร ชื่อลูกค้า ยี่ห้อ รุ่น สีรถ',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-checkin-scroll.png',
        title: 'กรอกรายละเอียดเพิ่ม',
        description: 'เลือกเลขไมล์ อาการที่แจ้ง มอบหมายช่าง',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-checkin-scroll2.png',
        title: 'เลือกบริการ',
        description: 'เลือกประเภทบริการ หมายเหตุ แล้วกดรับรถ',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-jobs-list.png',
        title: 'รายการงานซ่อม',
        description: 'ใบงานสร้างเสร็จ เห็นรายการทั้งหมดพร้อมสถานะ',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-job-detail.png',
        title: 'รายละเอียดใบงาน',
        description: 'กดเข้าดูรายละเอียด สถานะ ช่าง อะไหล่ ค่าใช้จ่าย',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-notifications.png',
        title: 'ลูกค้าได้แจ้งเตือน',
        description: 'ลูกค้าเห็นแจ้งเตือนอัตโนมัติว่ารถเข้ารับบริการแล้ว',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'online-booking',
    phase: 1,
    topicNumber: 2,
    title: 'ลูกค้าจองออนไลน์',
    subtitle: 'ระบบรับจองแทนแม้รับสายไม่ได้ — Admin เห็นคิวล่วงหน้า',
    icon: '📅',
    problem: 'ลูกค้าโทรจองแต่ช่างรับสายไม่ได้ สุดท้ายลูกค้าไปร้านอื่น',
    solution: 'ลูกค้ากดจองผ่าน LINE เลือกวันเวลา Admin กด CONFIRMED ในระบบ',
    values: [
      'ไม่พลาดลูกค้า — ระบบรับแทนแม้รับสายไม่ได้',
      'Admin เห็นคิวล่วงหน้า — จัดช่างได้ไม่วุ่นวาย',
      'ลูกค้าเก่าจองเร็วมาก — ข้อมูลรถอยู่ในระบบ',
    ],
    customerNote: 'ลูกค้าจองผ่าน LINE ได้ตลอด 24 ชม. ไม่ต้องโทร',
    steps: [
      {
        image: '/autocar/tutorial/customer-booking.png',
        title: 'หน้าจองคิว',
        description: 'ลูกค้ากดปุ่ม "เข้าซ่อม" เลือกรถ เลือกบริการ',
        viewport: 'customer',
      },
      {
        image: '/autocar/tutorial/customer-booking-scroll.png',
        title: 'เลือกวันเวลา',
        description: 'เลือกวัน เวลาที่สะดวก พิมพ์หมายเหตุ กดยืนยัน',
        viewport: 'customer',
      },
      {
        image: '/autocar/tutorial/admin-appointments.png',
        title: 'Admin เห็นนัดหมาย',
        description: 'Admin เห็นรายการนัดหมายทั้งหมด กด CONFIRMED ได้',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-appointments.png',
        title: 'ลูกค้าดูนัดหมาย',
        description: 'ลูกค้าเห็นสถานะนัดหมายของตัวเอง',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'estimate-approve',
    phase: 1,
    topicNumber: 3,
    title: 'ประเมินราคา + อนุมัติ',
    subtitle: 'มีหลักฐานเป็นลายลักษณ์อักษร ลูกค้าอนุมัติผ่านมือถือ',
    icon: '💰',
    problem: 'โทรบอกราคา ลูกค้าบอกเดี๋ยวคิดก่อน แล้วไม่โทรกลับ ไม่มีหลักฐาน',
    solution: 'ช่างสร้างใบเสนอราคาในระบบ ลูกค้ากดอนุมัติหรือปฏิเสธผ่านมือถือ',
    values: [
      'มีหลักฐานเป็นลายลักษณ์อักษร — ไม่มีโต้แย้งราคาทีหลัง',
      'ลูกค้าตัดสินใจเร็วขึ้น — ดูรายการชัด',
      'ช่างทำงานต่อได้เร็ว — ไม่ต้องรอสายโทรศัพท์',
    ],
    customerNote: 'ลูกค้าเห็นรายการอะไหล่ ค่าแรง ยอดรวม กดอนุมัติได้ทันที',
    steps: [
      {
        image: '/autocar/tutorial/admin-job-estimate.png',
        title: 'งานที่รอใบเสนอราคา',
        description: 'เปิดใบงาน เห็นสถานะ "ส่งใบเสนอราคา"',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-job-estimate-scroll.png',
        title: 'รายละเอียดใบเสนอราคา',
        description: 'รายการอะไหล่ ค่าแรง ยอดรวม',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-approvals.png',
        title: 'รายการรออนุมัติ',
        description: 'Admin ดูรายการทั้งหมดที่รอลูกค้าอนุมัติ',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-status.png',
        title: 'ลูกค้าดูสถานะ',
        description: 'ลูกค้าเห็นสถานะและกดอนุมัติผ่านมือถือ',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'tracking-delivery',
    phase: 1,
    topicNumber: 4,
    title: 'ติดตามงานซ่อม + ส่งมอบ',
    subtitle: 'ลูกค้าดูสถานะเองได้ ช่างทำงานต่อเนื่องไม่ต้องรับสาย',
    icon: '🔧',
    problem: '"รถเสร็จยัง?" ลูกค้าโทรถามทุกชั่วโมง ช่างต้องหยุดมือ',
    solution: 'ช่างเปลี่ยนสถานะบนมือถือ ระบบแจ้งลูกค้าอัตโนมัติ ลูกค้าเปิด Tracking ดูเอง',
    values: [
      'ลูกค้าไม่ต้องโทรถาม — ดูเองได้ 24 ชม.',
      'ช่างทำงานต่อเนื่อง — ไม่ต้องหยุดรับสาย',
      'ดูเป็นมืออาชีพ — มีระบบติดตามเหมือนบริษัทใหญ่',
    ],
    customerNote: 'ลูกค้าเห็นสถานะแบบ realtime + ให้คะแนนหลังรับรถ',
    steps: [
      {
        image: '/autocar/tutorial/admin-jobs-list.png',
        title: 'รายการงานซ่อม',
        description: 'Admin เห็นงานทั้งหมด กำลังทำ / เสร็จแล้ว / ทั้งหมด',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-job-detail-scroll.png',
        title: 'อัพเดทสถานะ',
        description: 'ช่างกดเปลี่ยนสถานะ ระบบแจ้งลูกค้าทันที',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-status.png',
        title: 'ลูกค้าติดตามสถานะ',
        description: 'ลูกค้าเปิดดูสถานะรถเหมือนติดตามพัสดุ',
        viewport: 'customer',
      },
      {
        image: '/autocar/tutorial/customer-after-service.png',
        title: 'ให้คะแนนหลังบริการ',
        description: 'รถเสร็จ ลูกค้าให้คะแนนความพึงพอใจ',
        viewport: 'customer',
      },
      {
        image: '/autocar/tutorial/admin-feedback.png',
        title: 'Admin ดูฟีดแบ็ก',
        description: 'เห็น feedback จริงจากลูกค้า นำไปปรับปรุงบริการ',
        viewport: 'admin',
      },
    ],
  },
  {
    id: 'carwash-stamp',
    phase: 2,
    topicNumber: 5,
    title: 'ล้างรถ + แสตมป์',
    subtitle: 'แสตมป์สะสมอัตโนมัติ ลูกค้ากลับมาซ้ำ ไม่ต้องจำเอง',
    icon: '🫧',
    problem: 'ลูกค้าถาม "ล้างครบ 10 ครั้งยัง?" จำไม่ได้ ต้องหาสมุดจด',
    solution: 'เปิดใบงานล้างรถ ระบบบวกแสตมป์อัตโนมัติ ครบ 10 ครั้งแจ้งเตือน',
    values: [
      'ลูกค้ากลับมาซ้ำ — เห็นแสตมป์ใกล้ครบ มีแรงจูงใจ',
      'ไม่ต้องจำเอง — ระบบจัดการให้',
      'ลดการโต้แย้ง — ลูกค้าดูแสตมป์เองได้',
    ],
    customerNote: 'ลูกค้าเห็นจำนวนแสตมป์สะสมในมือถือ',
    steps: [
      {
        image: '/autocar/tutorial/admin-carwash.png',
        title: 'รายการงานล้างรถ',
        description: 'Admin เปิดใบงานล้างรถ เลือกแพ็คเกจ เปลี่ยนสถานะ',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-services.png',
        title: 'รายการบริการ',
        description: 'ตั้งค่าแพ็คเกจล้างรถ ราคา เงื่อนไขแสตมป์',
        viewport: 'admin',
      },
    ],
  },
  {
    id: 'parts-stock',
    phase: 2,
    topicNumber: 6,
    title: 'สต็อกอะไหล่',
    subtitle: 'ตั้ง Min Stock แจ้งเตือนก่อนหมด ไม่ขาดสต็อกกระทันหัน',
    icon: '📦',
    problem: 'ผ้าเบรคหมด รู้ตอนช่างเปิดล้อแล้ว ลูกค้ารอ 2 ชม. สั่งของฉุกเฉิน',
    solution: 'ระบบจัดการสต็อก ตั้ง Min Stock แจ้งเตือนเมื่อต่ำ สั่งซื้อจาก Vendor ได้',
    values: [
      'ไม่ขาดสต็อกกระทันหัน — รู้ล่วงหน้า 2-3 วัน',
      'ไม่สั่งของมากเกิน — รู้จำนวนจริง',
      'ต้นทุนสต็อกลด — เงินไม่จมอยู่กับของ',
    ],
    customerNote: 'ลูกค้าไม่เห็นโดยตรง — แต่รถเสร็จตรงเวลา ไม่ต้องรอสั่งของ',
    steps: [
      {
        image: '/autocar/tutorial/admin-parts.png',
        title: 'ภาพรวมสต็อก',
        description: 'เห็นทั้งหมด 112 รายการ หมดสต็อก 0 ใกล้หมด 4 พร้อมใช้ 108',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-parts-scroll.png',
        title: 'รายการอะไหล่',
        description: 'ค้นหา ดูราคาขาย สต็อก สถานะ เพิ่มอะไหล่ใหม่',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-vendors.png',
        title: 'ผู้ขาย / ร้านบริการ',
        description: 'จัดการรายชื่อ Vendor สั่งซื้อผ่านระบบ',
        viewport: 'admin',
      },
    ],
  },
  {
    id: 'team-security',
    phase: 2,
    topicNumber: 7,
    title: 'จัดการทีม + ความปลอดภัย',
    subtitle: 'กำหนด Role ควบคุมสิทธิ์ ข้อมูลธุรกิจปลอดภัย',
    icon: '🔐',
    problem: 'ช่างเห็นราคาทุนทุกชิ้น วันหนึ่งลาออกไปเปิดร้านแข่ง',
    solution: 'กำหนด Role (Owner/Admin/Technician) ควบคุมสิทธิ์การมองเห็นข้อมูล',
    values: [
      'ข้อมูลธุรกิจปลอดภัย — ช่างรู้แค่ที่จำเป็น',
      'ให้คนใหม่เข้าระบบได้อย่างปลอดภัย',
      'ถ้าช่างออก — ปิด account ทันที',
    ],
    steps: [
      {
        image: '/autocar/tutorial/admin-permissions.png',
        title: 'จัดการสิทธิ์การมองเห็น',
        description: 'กำหนดว่าผู้ดูแลและช่างแต่ละคนเห็นข้อมูลอะไรบ้าง',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-permissions-scroll.png',
        title: 'รายชื่อทีม',
        description: 'ผู้ดูแล (Owner, Admin) และช่าง แยกชัดเจน',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-settings.png',
        title: 'ตั้งค่าร้าน',
        description: 'ตั้งค่าข้อมูลร้าน บริการ เวลาทำการ',
        viewport: 'admin',
      },
    ],
  },
  {
    id: 'customer-history',
    phase: 2,
    topicNumber: 8,
    title: 'ข้อมูลลูกค้า + ประวัติรถ',
    subtitle: 'ค้นหาจากทะเบียน เห็นประวัติซ่อมทุกครั้ง สร้างความไว้วางใจ',
    icon: '👤',
    problem: 'ลูกค้าเก่ามาอีกครั้งหลัง 1 ปี จำไม่ได้ว่าเคยทำอะไร',
    solution: 'ค้นหาด้วยป้ายทะเบียน เห็นประวัติซ่อมทุกครั้ง วันที่ อะไหล่ ราคา',
    values: [
      'ดูเป็นมืออาชีพ — จำข้อมูลลูกค้าได้ทุกคน',
      'แนะนำได้ถูกต้อง — ไม่เปลี่ยนของที่เพิ่งเปลี่ยน',
      'สร้างความไว้วางใจ — ลูกค้ารู้สึกว่าร้านใส่ใจ',
    ],
    customerNote: 'ลูกค้าเปิด App ดูประวัติบริการของตัวเองได้',
    steps: [
      {
        image: '/autocar/tutorial/admin-customers.png',
        title: 'รายชื่อลูกค้า',
        description: 'ค้นหาลูกค้าจากชื่อหรือทะเบียน',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-customer-detail.png',
        title: 'ข้อมูลลูกค้า',
        description: 'เห็นข้อมูลลูกค้า รถ ประวัติซ่อมทั้งหมด',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-history.png',
        title: 'ลูกค้าดูประวัติ',
        description: 'ลูกค้าเปิดดูประวัติบริการของตัวเองได้',
        viewport: 'customer',
      },
      {
        image: '/autocar/tutorial/customer-vehicles.png',
        title: 'ข้อมูลรถ',
        description: 'ดูข้อมูลรถ ระยะทาง รอบเปลี่ยนถ่าย',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'dashboard-report',
    phase: 2,
    topicNumber: 9,
    title: 'Dashboard รายงาน',
    subtitle: 'ตัดสินใจด้วยข้อมูลจริง ไม่ใช้ความรู้สึก',
    icon: '📊',
    problem: 'ไม่รู้ว่าวันนี้มีรายได้เท่าไหร่ งานค้างกี่คัน สินค้าไหนขายดี',
    solution: 'Dashboard แสดงงานซ่อมวันนี้ งานค้าง เสร็จวันนี้ กรองตามช่วงเวลาได้',
    values: [
      'ตัดสินใจด้วยข้อมูล — ไม่ใช้ความรู้สึก',
      'เห็นเทรนด์ — เดือนไหนลูกค้าเยอะ',
      'วางแผนขยายกิจการได้ — บนพื้นฐานข้อมูลจริง',
    ],
    steps: [
      {
        image: '/autocar/tutorial/admin-dashboard.png',
        title: 'ภาพรวมวันนี้',
        description: 'งานซ่อมวันนี้ งานล้าง งานค้าง เสร็จวันนี้ ดูได้ทันที',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-dashboard-scroll.png',
        title: 'รายการงานที่กำลังทำ',
        description: 'กรองวันนี้ สัปดาห์ เดือน ดูทั้งซ่อมและล้าง',
        viewport: 'admin',
      },
    ],
  },
  {
    id: 'promotions-campaigns',
    phase: 3,
    topicNumber: 10,
    title: 'โปรโมชั่น + แคมเปญ',
    subtitle: 'เทมเพลตสำเร็จรูป เลือก → ส่ง ลูกค้าเห็นบน LINE',
    icon: '📣',
    problem: 'ไม่มีเวลาคิดโปรโมชั่น ไม่รู้จะเริ่มยังไง',
    solution: 'เทมเพลตสำเร็จรูปพร้อมใช้ เลือก → เลือกกลุ่มลูกค้า → กดส่ง',
    values: [
      'ไม่ต้องคิดเอง — เทมเพลตสำเร็จรูป',
      'ส่งตรงถึง — ลูกค้าเห็นบน LINE',
      'ควบคุม Anti-Spam — ระบบจำกัดความถี่อัตโนมัติ',
    ],
    customerNote: 'ลูกค้าเห็นโปรโมชั่นในแอป กดรับสิทธิ์หรือแชร์ได้',
    steps: [
      {
        image: '/autocar/tutorial/admin-campaigns.png',
        title: 'จัดการโปรโมชั่น',
        description: 'สร้างแจ้งข่าวสารหรือโปรโมชั่น เลือกเทมเพลต กดส่ง',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-campaigns-scroll.png',
        title: 'รายการที่ส่งแล้ว',
        description: 'ดูสถิติ ส่งแล้วกี่ครั้ง เปิดอ่าน กดรับสิทธิ์',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/customer-promotions.png',
        title: 'ลูกค้าเห็นโปรโมชั่น',
        description: 'ลูกค้าได้รับแจ้งเตือนโปรโมชั่น กดดูรายละเอียด',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'pm-alerts',
    phase: 3,
    topicNumber: 11,
    title: 'PM แจ้งเตือนอัตโนมัติ',
    subtitle: 'ลูกค้าเก่ากลับมาเอง ระบบติดตามแทนคน รายได้สม่ำเสมอ',
    icon: '🔔',
    problem: 'ลูกค้าเปลี่ยนน้ำมันไป 6 เดือนไม่กลับมา ไม่มีใครติดตาม',
    solution: 'ระบบบันทึกวันเปลี่ยน แจ้งเตือนล่วงหน้า 7 วัน วันครบกำหนด และเกินกำหนด',
    values: [
      'ลูกค้าเก่ากลับมาเอง — ไม่ต้องหาลูกค้าใหม่ตลอด',
      'รายได้สม่ำเสมอ — คาดเดาได้',
      'ลูกค้ากลับมาซ้ำ = ร้านเติบโต',
    ],
    customerNote: 'ลูกค้าได้แจ้งเตือน "ครบกำหนดเปลี่ยนน้ำมัน" กดจองคิวได้เลย',
    steps: [
      {
        image: '/autocar/tutorial/admin-pm-monitor.png',
        title: 'ติดตาม PM',
        description: 'ดูรายการทั้งหมด ส่งเตือนแล้ว ครบกำหนด เลยกำหนด ปิดเตือน',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-pm-monitor-scroll.png',
        title: 'รายการที่ต้องติดตาม',
        description: 'ลูกค้า/รถ รายการ PM วันครบกำหนด สถานะ ส่งทดสอบได้',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-followup-alerts.png',
        title: 'งานค้างติดตาม',
        description: 'รายการที่ต้องติดตามทั้งหมดในระบบ',
        viewport: 'admin',
        highlight: 'ระบบติดตามอัตโนมัติ — ลดงานโทรตามลูกค้า',
      },
      {
        image: '/autocar/tutorial/customer-notifications.png',
        title: 'ลูกค้าได้แจ้งเตือน',
        description: 'ลูกค้าเห็นแจ้งเตือน PM ในแอป กดจองคิวได้เลย',
        viewport: 'customer',
      },
    ],
  },
  {
    id: 'health-check',
    phase: 4,
    topicNumber: 12,
    title: 'Health Check ระบบ',
    subtitle: 'Monitor 24/7 แจ้ง Telegram ภายใน 1 นาที เซิร์ฟเวอร์แยกเฉพาะร้าน',
    icon: '🛡️',
    problem: 'เว็บล่มเมื่อไหร่ไม่รู้ ไม่มีใครดูแลระบบ',
    solution: 'Health Check ทุก 5 นาที แจ้ง Telegram ภายใน 1 นาที เซิร์ฟเวอร์แยกเฉพาะร้าน',
    values: [
      'อุ่นใจ 24 ชม. — ไม่ต้องเช็คเอง',
      'แก้ไขก่อนลูกค้ารู้สึก',
      'ไม่ต้องเป็น IT — มีคนดูแลให้',
    ],
    steps: [
      {
        image: '/autocar/tutorial/admin-settings.png',
        title: 'ตั้งค่าระบบ',
        description: 'จัดการข้อมูลร้าน เซิร์ฟเวอร์ การแจ้งเตือน',
        viewport: 'admin',
      },
      {
        image: '/autocar/tutorial/admin-settings-scroll.png',
        title: 'ตั้งค่าเพิ่มเติม',
        description: 'ตั้งค่าบริการ เวลาทำการ การเชื่อมต่อ',
        viewport: 'admin',
        highlight:
          'เซิร์ฟเวอร์แยกเฉพาะร้าน — ข้อมูลเป็นของคุณคนเดียว UptimeRobot Monitor 24/7',
      },
    ],
  },
]
