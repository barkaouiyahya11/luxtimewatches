'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  products: Product[]
}

const CARD_SIMPLE = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777815524/luxtim/ztmuttn9htbiwdazq7hr.jpg'
const CARD_COFFRET = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777815586/luxtim/wkm4fuk4euy0dmmtggm8.jpg'

export default function FemmeSection({ products }: Props) {
  const router = useRouter()

  const simpleCount = products.filter((p) => !p.coffret).length
  const coffretCount = products.filter((p) => p.coffret).length

  return (
    <section id="coll-femme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">

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
          Sublime ta beauté avec nos montres ✨
        </p>
      </div>

      {/* Two category cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">

        {/* BOITE SIMPLE */}
        <button
          onClick={() => router.push('/collection/femme-simple')}
          className="group text-left flex flex-col"
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3]"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_SIMPLE}
              alt="Boite Simple"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>
          <div className="pt-4 px-1">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
              Collection Femme
            </p>
            <h3 className="text-base md:text-xl font-black uppercase tracking-wider text-black leading-tight">
              Boite Simple
            </h3>
            <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-semibold">
              {simpleCount} article{simpleCount > 1 ? 's' : ''}
            </p>
            <div className="mt-3">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest text-black border border-black px-4 py-2 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>

        {/* AVEC COFFRET */}
        <button
          onClick={() => router.push('/collection/femme-coffret')}
          className="group text-left flex flex-col"
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3]"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_COFFRET}
              alt="Avec Coffret"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>
          <div className="pt-4 px-1">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
              Collection Femme
            </p>
            <h3 className="text-base md:text-xl font-black uppercase tracking-wider text-black leading-tight">
              Avec Coffret
            </h3>
            <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-semibold">
              {coffretCount} article{coffretCount > 1 ? 's' : ''}
            </p>
            <div className="mt-3">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest border border-[#C5A059] text-[#C5A059] px-4 py-2 rounded-full group-hover:bg-[#C5A059] group-hover:text-black transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>

      </div>
    </section>
  )
}
