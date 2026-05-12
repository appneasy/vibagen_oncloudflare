'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'

const budgetOptions = [
  'ไม่เกิน 50,000 บาท',
  '50,000–150,000 บาท',
  '150,000–500,000 บาท',
  '500,000 บาท ขึ้นไป',
  'ยังไม่แน่ใจ — อยากพูดคุยก่อน',
]

const industryOptions = [
  'Automotive / Car Care',
  'Manufacturing / โรงงาน',
  'Retail / E-commerce',
  'Service / Professional',
  'Food & Beverage',
  'Healthcare',
  'อื่นๆ',
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    problem: '',
    budget: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
      setForm({ name: '', email: '', company: '', industry: '', problem: '', budget: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = [
    'w-full px-4 py-3 rounded-xl text-white text-sm',
    'bg-white/[0.06] border border-white/[0.10]',
    'focus:outline-none focus:border-[#ff6c01] focus:bg-white/[0.08]',
    'placeholder:text-white/30',
    'transition-all duration-200',
  ].join(' ')

  return (
    <section
      className="section"
      style={{ background: '#011937' }}
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <div>
            <Badge dot className="mb-4">
              ปรึกษาฟรี
            </Badge>
            <h2
              id="contact-heading"
              className="font-[--font-heading] font-bold text-white mb-6"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              เล่าปัญหาให้ฟัง
              <br />
              <span className="text-[#ff6c01]">เราช่วยหาทางออก</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              ไม่ต้องรู้ว่าต้องการอะไรแน่ๆ แค่เล่าสิ่งที่เป็นปัญหาในธุรกิจตอนนี้
              เราจะวิเคราะห์และเสนอแนวทางให้
            </p>

            {/* Trust signals */}
            <div className="space-y-4">
              {[
                { icon: '⚡', text: 'ตอบกลับภายใน 24 ชั่วโมง' },
                { icon: '🔒', text: 'ข้อมูลของคุณเป็นความลับ 100%' },
                { icon: '🎯', text: 'ปรึกษาฟรี ไม่มีข้อผูกมัด' },
                { icon: '🏗️', text: 'ประเมิน timeline + ราคาในการโทร' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-xl" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-white/70 text-base">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div className="rounded-2xl p-8 text-center bg-white/[0.04] border border-[#ff6c01]/20">
                <span className="text-5xl block mb-4" role="img" aria-label="สำเร็จ">🎉</span>
                <h3 className="font-[--font-heading] font-bold text-white text-2xl mb-2">
                  ส่งเรียบร้อยแล้ว!
                </h3>
                <p className="text-white/60">
                  เราจะติดต่อกลับภายใน 24 ชั่วโมง ขอบคุณที่ไว้วางใจ VIBAGEN
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-white/60 text-xs mb-1.5">
                      ชื่อ–นามสกุล <span className="text-[#ff6c01]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="คุณ..."
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white/60 text-xs mb-1.5">
                      อีเมล <span className="text-[#ff6c01]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Company + Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-white/60 text-xs mb-1.5">
                      บริษัท / ร้าน
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="ชื่อธุรกิจ"
                      value={form.company}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-white/60 text-xs mb-1.5">
                      ประเภทธุรกิจ
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className={inputClass + ' cursor-pointer'}
                    >
                      <option value="" className="bg-[#0d2749]">-- เลือก --</option>
                      {industryOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0d2749]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Problem */}
                <div>
                  <label htmlFor="problem" className="block text-white/60 text-xs mb-1.5">
                    ปัญหาหรือสิ่งที่ต้องการ <span className="text-[#ff6c01]">*</span>
                  </label>
                  <textarea
                    id="problem"
                    name="problem"
                    required
                    rows={5}
                    placeholder="เล่าให้ฟังได้เลย — ปัญหาที่เจออยู่, ระบบที่ใช้อยู่ตอนนี้, สิ่งที่อยากได้..."
                    value={form.problem}
                    onChange={handleChange}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-white/60 text-xs mb-1.5">
                    งบประมาณที่คาดว่ามี
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="" className="bg-[#0d2749]">-- เลือก (ไม่บังคับ) --</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0d2749]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={[
                    'w-full py-4 rounded-xl font-[--font-heading] font-semibold text-white text-base',
                    'bg-[#ff6c01] hover:bg-[#d54e01]',
                    'transition-all duration-200',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6c01]',
                  ].join(' ')}
                >
                  {status === 'loading' ? 'กำลังส่ง...' : 'ส่งข้อความหา VIBAGEN →'}
                </button>

                {status === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    เกิดข้อผิดพลาด กรุณาลองใหม่หรือติดต่อ akkraphol@gmail.com โดยตรง
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
