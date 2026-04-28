'use client'

import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  products: Product[]
  singleRow?: boolean   // desktop: 4 cols, mobile: 2 cols grid
  scrollRow?: boolean   // mobile: horizontal scroll, desktop: 4 cols
}

export default function ProductGrid({ products, singleRow, scrollRow }: Props) {
  useScrollReveal()

  if (scrollRow) {
    return (
      <>
        {/* Mobile — horizontal scroll */}
        <div
          className="md:hidden flex gap-3 overflow-x-auto pb-4 px-1"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{ flex: '0 0 48%', scrollSnapAlign: 'start' }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Desktop — normal grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </>
    )
  }

  return (
    <div
      className={
        singleRow
          ? 'grid grid-cols-4 gap-2 md:gap-6'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8'
      }
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
