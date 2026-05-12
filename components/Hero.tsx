'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = ['https://res.cloudinary.com/dannr2e0c/image/upload/v1778623885/luxtim/l9lsbiph4h9sck2lbrka.jpg']

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="hero-container relative w-full overflow-hidden"
      style={{
        aspectRatio: '4/5',
        maxHeight: '92vh',
        marginBottom: 0,
        display: 'block',
        lineHeight: 0,
      }}
    >
      {/* ── Slide track ── */}
      <div
        style={{
          display: 'flex',
          width: `${SLIDES.length * 100}%`,
          height: '100%',
          transform: `translateX(-${(current * 100) / SLIDES.length}%)`,
          transition: 'transform 1s cubic-bezier(0.77, 0, 0.18, 1)',
        }}
      >
        {SLIDES.map((src) => (
          <div
            key={src}
            style={{
              width: `${100 / SLIDES.length}%`,
              height: '100%',
              flexShrink: 0,
              backgroundImage: `url('${src}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
            }}
          />
        ))}
      </div>

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* ── Texte hero ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end pointer-events-none"
        style={{
          padding: 'clamp(24px, 6vw, 56px)',
          paddingBottom: 'clamp(60px, 10vw, 100px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
          zIndex: 2,
        }}
      >
        {/* Ligne dorée */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#C6A769',
          marginBottom: '16px',
        }} />

        {/* Sous-titre */}
        <p style={{
          fontSize: 'clamp(9px, 2vw, 11px)',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#C6A769',
          marginBottom: '10px',
          fontFamily: 'var(--font-inter), sans-serif',
        }}>
          Collection Exclusive · Maroc
        </p>

        {/* Titre principal */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(2rem, 9vw, 4.5rem)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          marginBottom: '6px',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          L&apos;Élégance
        </h1>
        <h1 style={{
          fontFamily: 'var(--font-allura), cursive',
          fontSize: 'clamp(2.2rem, 10vw, 5rem)',
          fontWeight: 400,
          color: '#C6A769',
          lineHeight: 1.1,
          marginBottom: '20px',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          à votre poignet
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 'clamp(11px, 2.5vw, 13px)',
          color: 'rgba(255,255,255,0.75)',
          fontWeight: 400,
          letterSpacing: '0.04em',
          marginBottom: '28px',
          maxWidth: '280px',
          lineHeight: 1.6,
          fontFamily: 'var(--font-inter), sans-serif',
        }}>
          Montres de luxe à partir de 149 MAD.<br />
          Livraison gratuite · Paiement à la livraison.
        </p>

        {/* CTA */}
        <div className="pointer-events-auto" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/collection/femme"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: 'clamp(10px,2vw,14px) clamp(20px,4vw,32px)',
              background: '#C6A769',
              color: '#000',
              fontSize: 'clamp(9px, 2vw, 11px)',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Découvrir la collection
          </Link>
        </div>
      </div>

      {/* Wave bottom curve */}
      <div className="absolute bottom-0 left-0 w-full leading-none" style={{ zIndex: 3 }}>
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '60px' }}
        >
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="#FAF9F7" />
          <rect x="0" y="79" width="1440" height="2" fill="#FAF9F7" />
        </svg>
      </div>
    </section>
  )
}
