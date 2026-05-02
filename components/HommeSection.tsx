'use client'

import { useState } from 'react'
import { Product } from '@/types'
import ProductGrid from '@/components/ProductGrid'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  products: Product[]
}

const CARD_SIMPLE = 'https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg'
const CARD_COFFRET = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777675221/luxtim/espf5fbjdccmvejteldv.jpg'

export default function HommeSection({ products }: Props) {
  const [selected, setSelected] = useState<'simple' | 'coffret' | null>(null)
  useScrollReveal()

  const simple = products.filter((p) => !p.coffret)
  const coffret = products.filter((p) => p.coffret)
  const shown = selected === 'simple' ? simple : selected === 'coffret' ? coffret : null

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
      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
        {/* BOITE SIMPLE */}
        <button
          onClick={() => setSelected(selected === 'simple' ? null : 'simple')}
          className="relative group overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3] text-left transition-all duration-300"
          style={{
            boxShadow: selected === 'simple'
              ? '0 0 0 3px #C5A059'
              : '0 4px 24px rgba(0,0,0,0.12)',
          }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_SIMPLE}
            alt="Boite Simple"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.5) 100%)',
            }}
          />
          {/* Text */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-base md:text-2xl font-black uppercase tracking-wider text-white leading-tight">
              Boite Simple
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white border border-white/60 px-3 py-1.5 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                {selected === 'simple' ? '✓ Sélectionné' : 'Voir →'}
              </span>
            </div>
          </div>

          {/* Selected indicator */}
          {selected === 'simple' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-[#C5A059] rounded-full flex items-center justify-center">
              <span className="text-black text-[10px] font-black">✓</span>
            </div>
          )}
        </button>

        {/* AVEC COFFRET */}
        <button
          onClick={() => setSelected(selected === 'coffret' ? null : 'coffret')}
          className="relative group overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/3] text-left transition-all duration-300"
          style={{
            boxShadow: selected === 'coffret'
              ? '0 0 0 3px #C5A059'
              : '0 4px 24px rgba(0,0,0,0.12)',
          }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_COFFRET}
            alt="Avec Coffret"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Warm golden overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(120,70,10,0.55) 0%, rgba(80,40,0,0.20) 60%, rgba(100,55,5,0.55) 100%)',
            }}
          />
          {/* Text */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-1">
              Collection Hommes
            </p>
            <h3 className="text-base md:text-2xl font-black uppercase tracking-wider text-white leading-tight">
              Avec Coffret
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white border border-white/60 px-3 py-1.5 rounded-full group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-black transition-all duration-300">
                {selected === 'coffret' ? '✓ Sélectionné' : 'Voir →'}
              </span>
            </div>
          </div>

          {/* Selected indicator */}
          {selected === 'coffret' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-[#C5A059] rounded-full flex items-center justify-center">
              <span className="text-black text-[10px] font-black">✓</span>
            </div>
          )}
        </button>
      </div>

      {/* Products grid — appears when a category is selected */}
      {shown && (
        <div>
          {/* Back/filter bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Affichage :
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-full">
                {selected === 'simple' ? 'Boite Simple' : 'Avec Coffret'} ({shown.length})
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition border border-gray-200 hover:border-black px-4 py-1.5 rounded-full"
            >
              ✕ Fermer
            </button>
          </div>
          <ProductGrid products={shown} />
        </div>
      )}

      {/* If nothing selected: show all products as default grid */}
      {!selected && (
        <ProductGrid products={products} />
      )}
    </section>
  )
}
