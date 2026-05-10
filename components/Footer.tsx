'use client'

import { WHATSAPP_NUMBER, TIKTOK_URL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="py-12 text-center mt-8" style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5' }}>
      <div className="flex flex-col items-center gap-4 mb-10">
        <button
          onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
          className="bg-[#25d366] text-white px-10 py-4 rounded-full font-black text-[12px] uppercase tracking-widest shadow-lg hover:scale-105 transition flex items-center gap-3"
        >
          <i className="fa-brands fa-whatsapp text-xl" /> Contacter le Support
        </button>
        <p className="font-arabic text-[13px] text-gray-400">تواصل معنا عبر الواتساب لأي استفسار</p>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        <button
          onClick={() => window.open(TIKTOK_URL, '_blank')}
          className="text-gray-400 hover:text-black hover:scale-110 transition"
          aria-label="TikTok"
        >
          <i className="fa-brands fa-tiktok text-3xl" />
        </button>
        <button
          onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
          className="text-gray-400 hover:text-[#25d366] hover:scale-110 transition"
          aria-label="WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-3xl" />
        </button>
      </div>

      <div className="w-24 h-px mx-auto mb-6 bg-gray-200" />
      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">
        © 2026 GUSHKIN MAROC. TOUS DROITS RÉSERVÉS.
      </p>
    </footer>
  )
}
