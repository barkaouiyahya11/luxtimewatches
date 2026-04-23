'use client'

import { useStore } from '@/context/StoreContext'

export default function Lightbox() {
  const { lightbox, closeLightbox } = useStore()

  if (!lightbox.isOpen && !lightbox.src) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        lightbox.isOpen ? 'bg-black/[.88]' : 'bg-transparent pointer-events-none'
      }`}
      onClick={closeLightbox}
    >
      <button
        className="fixed top-4 right-4 z-[10001] w-[42px] h-[42px] bg-white/15 border border-white/25 text-white text-xl rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition"
        onClick={(e) => { e.stopPropagation(); closeLightbox() }}
        aria-label="Fermer"
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lightbox.src}
        alt=""
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl block"
        style={{
          transform: lightbox.isOpen ? 'scale(1)' : 'scale(0.7)',
          opacity: lightbox.isOpen ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
