'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  products: Product[]
}

const CARD_SIMPLE = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777747850/luxtim/e674kdpmxph43lddqqut.jpg'
const CARD_COFFRET = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777749218/luxtim/ldz36jecb5ywkphillhw.jpg'

export default function HommeSection({ products }: Props) {
  const router = useRouter()

  const simpleCount = products.filter((p) => !p.coffret).length
  const coffretCount = products.filter((p) => p.coffret).length

  return (
    <section id="coll-homme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">

      {/* Section title */}
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#C6A769', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
          Sélection Exclusive
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.15 }}>
          Collection Homme
        </h2>
        <div style={{ width: '40px', height: '1px', background: '#C6A769', margin: '14px auto 0' }} />
        <p style={{ fontSize: '12px', color: '#6E6E6E', marginTop: '10px', letterSpacing: '0.05em' }}>
          Montres minimalistes sélectionnées avec élégance.
        </p>
      </div>

      {/* Two category cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">

        {/* BOITE SIMPLE */}
        <button
          onClick={() => router.push('/collection/homme-simple')}
          className="group text-left flex flex-col"
        >
          {/* Image */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: '1/1',
              borderRadius: '12px',
              background: '#F9F8F6',
              border: '1px solid rgba(0,0,0,0.03)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <Image
              src={CARD_SIMPLE}
              alt="Boite Simple"
              fill
              quality={85}
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 homme-card-simple"
            />
            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
          </div>

          {/* Text below image */}
          <div className="pt-4 px-1">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-base md:text-xl font-black uppercase tracking-wider text-black leading-tight">
              Boite Simple
            </h3>
            <div className="mt-3">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest text-black border border-black px-4 py-2 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>

        {/* AVEC COFFRET */}
        <button
          onClick={() => router.push('/collection/homme-coffret')}
          className="group text-left flex flex-col"
        >
          {/* Image */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: '1/1',
              borderRadius: '12px',
              background: '#F9F8F6',
              border: '1px solid rgba(0,0,0,0.03)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <Image
              src={CARD_COFFRET}
              alt="Avec Coffret"
              fill
              quality={85}
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 homme-card-coffret"
            />
            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
          </div>

          {/* Text below image */}
          <div className="pt-4 px-1">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-base md:text-xl font-black uppercase tracking-wider text-black leading-tight">
              Avec Coffret
            </h3>
            <div className="mt-3">
              <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-widest text-black border border-[#C5A059] text-[#C5A059] px-4 py-2 rounded-full group-hover:bg-[#C5A059] group-hover:text-black transition-all duration-300">
                Voir →
              </span>
            </div>
          </div>
        </button>

      </div>
    </section>
  )
}
