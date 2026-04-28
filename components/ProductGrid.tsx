'use client'

import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  useScrollReveal()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
