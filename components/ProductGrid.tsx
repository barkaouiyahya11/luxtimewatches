'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  products: Product[]
  singleRow?: boolean
  scrollRow?: boolean
}

/* Compact card used in singleRow — taller image, minimal text */
function CompactCard({ product }: { product: Product }) {
  const router = useRouter()
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image — portrait 3:4 ratio */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '3/4' }}>
        {product.hot && (
          <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded z-10">
            HOT
          </div>
        )}
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black px-1 py-0.5 rounded z-10">
          -{discount}%
        </div>
        <Image
          src={product.gridImg}
          alt={product.name}
          fill
          quality={85}
          sizes="(max-width: 768px) 55vw, 25vw"
          className="object-cover"
        />
      </div>
      {/* Minimal text */}
      <div className="pt-1.5 text-center px-0.5">
        <p className="text-[8px] font-black uppercase text-gray-800 leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-[9px] font-black text-black mt-0.5">
          {product.price} <span className="text-[7px] text-gray-500">MAD</span>
        </p>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, singleRow, scrollRow }: Props) {
  useScrollReveal()

  if (scrollRow) {
    return (
      <>
        <div
          className="md:hidden flex gap-3 pb-4 px-1"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            touchAction: 'pan-x',
          }}
        >
          {products.map((p) => (
            <div key={p.id} className="scroll-reveal visible" style={{ flex: '0 0 55%', minWidth: 0 }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </>
    )
  }

  if (singleRow) {
    return (
      <>
        {/* Mobile — 4 cols with taller CompactCard */}
        <div className="grid grid-cols-4 gap-2 md:hidden">
          {products.map((p) => (
            <CompactCard key={p.id} product={p} />
          ))}
        </div>
        {/* Desktop — normal ProductCard 4 cols */}
        <div className="hidden md:grid md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} revealDelay={(i % 4) * 90} />
      ))}
    </div>
  )
}
