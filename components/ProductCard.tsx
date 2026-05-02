'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const router = useRouter()
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <div
      id={`prod-card-${product.id}`}
      className="product-card group scroll-reveal cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden mb-3" style={{ borderRadius: '6px' }}>
        {product.hot && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 uppercase z-10">
            HOT
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5">
          -{discount}%
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.gridImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Text — left aligned like the reference */}
      <div className="px-0.5">
        <h3 className="text-[11px] md:text-sm font-black uppercase text-black leading-snug mb-2">
          {product.name}
        </h3>
        <p className="text-black font-black text-sm md:text-base tracking-wide">
          {product.price}.00 <span className="text-[11px] text-gray-500 font-semibold">MAD</span>
        </p>
      </div>
    </div>
  )
}
