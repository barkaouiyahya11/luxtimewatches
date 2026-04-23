'use client'

import { useStore } from '@/context/StoreContext'

export default function Toast() {
  const { toast } = useStore()

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest z-[6000] transition-all duration-300 shadow-xl flex items-center gap-2 pointer-events-none ${
        toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <i className="fa-solid fa-check text-[#C5A059]" />
      {toast.message}
    </div>
  )
}
