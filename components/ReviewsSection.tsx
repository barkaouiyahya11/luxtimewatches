'use client'

import { Review } from '@/types'
import { useStore } from '@/context/StoreContext'

interface Props {
  reviews: Review[]
}

export default function ReviewsSection({ reviews }: Props) {
  const { openReview } = useStore()

  return (
    <section className="py-16 px-4 md:px-8 bg-[#fdfbf8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black text-center">
            Avis de nos clients
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {reviews.map((r, i) => {
              const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)
              const initial = r.name.charAt(0).toUpperCase()
              return (
                <div
                  key={i}
                  className="scroll-reveal bg-white rounded-2xl p-6 shadow-sm border border-[#f5f0e8] hover:-translate-y-1 hover:shadow-md transition"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="text-[#f59e0b] text-sm mb-3">{stars}</div>
                  <p className="text-gray-600 text-[12px] leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A059] to-[#d4b572] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="font-black text-[11px] text-gray-800 uppercase">{r.name}</p>
                      <p className="text-[10px] text-gray-400">{r.city}</p>
                    </div>
                    <span className="ml-auto bg-green-100 text-green-700 text-[8px] font-bold px-2 py-1 rounded-full flex-shrink-0">
                      ✓ Vérifié
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 mb-12">
            <i className="fa-regular fa-comment-dots text-4xl text-gray-200 mb-4 block" />
            <p className="text-gray-400 text-[12px] uppercase font-bold tracking-widest">
              Soyez le premier à laisser un avis !
            </p>
            <p className="font-arabic text-gray-400 text-[13px] mt-1">كن أول من يترك تقييماً</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={openReview}
            className="inline-flex items-center gap-3 border-2 border-[#C5A059] text-[#C5A059] px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition"
          >
            <i className="fa-solid fa-pen-to-square" /> Laisser un avis
            <span className="font-arabic text-[13px]">أضف تقييمك</span>
          </button>
        </div>
      </div>
    </section>
  )
}
