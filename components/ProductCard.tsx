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
      className="product-card group scroll-reveal"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="img-container aspect-square mb-3 relative">
        {product.hot && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-[8px] font-black px-3 py-1 uppercase rounded shadow-lg z-10">
            HOT
          </div>
        )}
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
          -{discount}%
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.gridImg}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="px-2 text-center">
        <h3 className="text-[10px] md:text-[11px] font-bold uppercase mb-1 text-gray-800 leading-tight h-8 flex items-center justify-center">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-[#f59e0b] text-[9px]">★★★★★</span>
          <span className="text-[9px] text-gray-500 font-semibold">({product.reviews})</span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-black font-black text-sm tracking-widest">
            {product.price}.00 <span className="text-[10px] text-gray-500">MAD</span>
          </p>
          <span className="line-through text-gray-400 text-[10px] font-semibold">
            {product.originalPrice}.00 MAD
          </span>
        </div>
      </div>
    </div>
  )
}
