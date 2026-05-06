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
      {/* Image Container */}
      <div
        className="relative w-full overflow-hidden mb-4"
        style={{
          aspectRatio: '4/5',
          borderRadius: '12px',
          background: '#F9F8F6',
          border: product.frame
            ? '2px solid #C5A059'
            : '1.5px solid #111111',
          boxShadow: product.frame
            ? '0 4px 24px rgba(197,160,89,0.15)'
            : '0 2px 12px rgba(0,0,0,0.08)',
          padding: '3px',
        }}
      >
        {/* The Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.gridImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            objectPosition: product.imgPosition || 'center',
            transform: `scale(${product.imgScale || 1})`,
            transformOrigin: product.imgPosition || 'center',
          }}
          loading="lazy"
        />

        {/* Hover overlay for a bit of dynamic feel */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* Text */}
      <div className="px-1 pt-2 flex flex-col items-center text-center">
        <h3
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(13px, 2.5vw, 16px)',
            fontWeight: 600,
            color: '#111111',
            letterSpacing: '0.06em',
            lineHeight: 1.4,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          {product.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#6E6E6E', fontWeight: 500, letterSpacing: '0.04em' }}>
          {product.price} MAD
        </p>
      </div>
    </div>
  )
}
