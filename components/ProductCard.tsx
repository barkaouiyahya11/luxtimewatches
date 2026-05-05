'use client'

import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const router = useRouter()

  return (
    <div
      id={`prod-card-${product.id}`}
      className="product-card group scroll-reveal cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-square overflow-hidden mb-3"
        style={{
          borderRadius: '6px',
          ...(product.frame ? {
            border: '3px solid #C5A059',
            boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 1px #C5A059, 0 4px 18px rgba(197,160,89,0.25)',
            padding: '4px',
            background: '#fff',
          } : {}),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.gridImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{
            borderRadius: '3px',
            objectPosition: product.imgPosition || 'center',
            transform: `scale(${product.imgScale || 1})`,
            transformOrigin: product.imgPosition || 'center',
          }}
          loading="lazy"
        />
      </div>

      {/* Text — left aligned like the reference */}
      <div className="px-0.5">
        <h3 className="text-[11px] md:text-[13px] font-bold uppercase text-black leading-snug mb-1.5 tracking-wide">
          {product.name}
        </h3>
        <p className="text-black font-semibold text-[12px] md:text-[13px]">
          Dh {product.price}.00 MAD
        </p>
      </div>
    </div>
  )
}
