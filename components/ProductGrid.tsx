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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {homme.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
