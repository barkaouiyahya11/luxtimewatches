'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const router = useRouter()

  const slides = product.coffret && product.detailImgs?.length
    ? [product.gridImg, ...product.detailImgs]
    : [product.gridImg]

  const [idx, setIdx] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [sliding, setSliding] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      const nextIdx = (idx + 1) % slides.length
      setNext(nextIdx)
      setSliding(true)
      setTimeout(() => {
        setIdx(nextIdx)
        setNext(null)
        setSliding(false)
      }, 600)
    }, 3000)
    return () => clearInterval(interval)
  }, [idx, slides.length])

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
        {/* Current image — slides OUT to left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slides[idx]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: product.imgPosition || 'center',
            transform: sliding
              ? 'translateX(-100%)'
              : `scale(${product.imgScale || 1})`,
            transformOrigin: product.imgPosition || 'center',
            transition: sliding ? 'transform 0.6s cubic-bezier(0.77,0,0.18,1)' : 'none',
          }}
          loading="lazy"
        />

        {/* Next image — slides IN from right */}
        {next !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slides[next]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: product.imgPosition || 'center',
              transform: sliding ? 'translateX(0%)' : 'translateX(100%)',
              transition: sliding ? 'transform 0.6s cubic-bezier(0.77,0,0.18,1)' : 'none',
            }}
            loading="lazy"
          />
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none z-10">
            {slides.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === idx ? '14px' : '5px',
                  height: '5px',
                  borderRadius: '3px',
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none z-10" />
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
