'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'

interface Props {
  product: Product
  revealDelay?: number
}

export default function ProductCard({ product, revealDelay = 0 }: Props) {
  const router = useRouter()

  return (
    <div
      id={`prod-card-${product.id}`}
      className="product-card group scroll-reveal cursor-pointer"
      data-reveal-delay={revealDelay}
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div
        className="relative w-full overflow-hidden mb-4"
        style={{
          aspectRatio: '4/5',
          borderRadius: '0px',
          background: '#F9F8F6',
          border: product.frame
            ? '1.5px solid #C5A059'
            : '0.8px solid #111111',
          boxShadow: product.frame
            ? '0 4px 24px rgba(197,160,89,0.15)'
            : '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Image
          src={product.gridImg}
          alt={product.name}
          fill
          quality={85}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          style={{
            objectPosition: product.imgPosition || 'center',
            transform: `scale(${product.imgScale || 1})`,
            transformOrigin: product.imgPosition || 'center',
            borderRadius: '0px',
          }}
        />
        {/* Overlay hover luxe */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-500 pointer-events-none" />
        {/* Ligne dorée en bas au hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
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
        <p style={{ fontSize: '13px', color: '#333333', fontWeight: 400, letterSpacing: '0.01em', fontFamily: 'inherit' }}>
          {product.price}.00 DH
        </p>
      </div>
    </div>
  )
}
