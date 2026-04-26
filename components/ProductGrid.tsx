'use client'

import { Product } from '@/types'
import ProductCard from './ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  useScrollReveal()

  const femme = products.filter((p) => p.cat === 'femme')
  const homme = products.filter((p) => p.cat === 'homme')

  return (
    <div className="px-4 md:px-8 py-10 text-center max-w-7xl mx-auto">
      <section id="coll-femme" className="mb-16 md:mb-24">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
            Collection Femme
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>

        {/* Category Visual Selector - Femme */}
        <div className="flex gap-2 mb-10">
          <div
            className="w-1/2 cursor-pointer group"
            onClick={() => document.getElementById('grid-femme')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src="https://i.ibb.co/TqdL78K6/Whats-App-Image-2026-03-23-at-17-58-22.jpg"
                alt="Boîte Simple"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-white pt-3 text-left">
              <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">BOÎTE SIMPLE →</p>
            </div>
          </div>
          <div className="w-1/2 cursor-default group">
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src="https://i.ibb.co/TqdL78K6/Whats-App-Image-2026-03-23-at-17-58-22.jpg"
                alt="Avec Packaging"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-white pt-3 text-left">
              <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">AVEC PACKAGING →</p>
            </div>
          </div>
        </div>

        <div id="grid-femme" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {femme.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="coll-homme">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
            Collection Homme
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>

        {/* Category Visual Selector - Homme */}
        <div className="flex gap-2 mb-10">
          <div
            className="w-1/2 cursor-pointer group"
            onClick={() => document.getElementById('grid-homme')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src="https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg"
                alt="Boîte Simple"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-white pt-3 text-left">
              <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">BOÎTE SIMPLE →</p>
            </div>
          </div>
          <div className="w-1/2 cursor-default group">
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src="https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg"
                alt="Avec Packaging"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-white pt-3 text-left">
              <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">AVEC PACKAGING →</p>
            </div>
          </div>
        </div>

        <div id="grid-homme" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {homme.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
