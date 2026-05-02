'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  products: Product[]
}

const CARD_SIMPLE = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777733073/luxtim/wi4etvzm7bfhghgd8u6d.jpg'
const CARD_COFFRET = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777675221/luxtim/espf5fbjdccmvejteldv.jpg'

export default function HommeSection({ products }: Props) {
  const router = useRouter()

  const simpleCount = products.filter((p) => !p.coffret).length
  const coffretCount = products.filter((p) => p.coffret).length

  return (
    <section id="coll-homme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">

      {/* Section title */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2
            style={{
              fontFamily: 'var(--font-allura), cursive',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
              textTransform: 'none',
              letterSpacing: '0.02em',
              color: '#000',
              lineHeight: 1.2,
            }}
          >
            Nos Best Products
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
          Style & élégance pour homme ✨
        </p>
      </div>

      {/* Two category cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">

        {/* BOITE SIMPLE */}
        <button
          onClick={() => router.push('/collection/homme-simple')}
          className="relative group overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3] text-left"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_SIMPLE}
            alt="Boite Simple"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-7">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-lg md:text-3xl font-black uppercase tracking-wider text-white leading-tight">
              Boite Simple
            </h3>
            <p className="text-[9px] md:text-xs text-white/60 mt-1 font-semibold">
              {simpleCount} article{simpleCount > 1 ? 's' : ''}
            </p>
            <div className="mt-4">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest text-white border border-white/50 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>

        {/* AVEC COFFRET */}
        <button
          onClick={() => router.push('/collection/homme-coffret')}
          className="relative group overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3] text-left"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_COFFRET}
            alt="Avec Coffret"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(100,55,5,0.65) 0%, rgba(80,40,0,0.15) 55%, rgba(100,55,5,0.60) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-7">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-lg md:text-3xl font-black uppercase tracking-wider text-white leading-tight">
              Avec Coffret
            </h3>
            <p className="text-[9px] md:text-xs text-white/60 mt-1 font-semibold">
              {coffretCount} article{coffretCount > 1 ? 's' : ''}
            </p>
            <div className="mt-4">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest text-white border border-white/50 px-4 py-2 rounded-full group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-black transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>
      </div>
    </section>
  )
}
