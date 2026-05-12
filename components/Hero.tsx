'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  'https://res.cloudinary.com/dannr2e0c/image/upload/e_improve:50,e_contrast:25,e_brightness:-5,e_saturation:-15/v1778623885/luxtim/l9lsbiph4h9sck2lbrka.jpg'
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="hero-container relative w-full overflow-hidden"
      style={{ aspectRatio: '4/5', maxHeight: '92vh', display: 'block', lineHeight: 0 }}
    >
      {/* ── Image ── */}
      <div
        style={{
          display: 'flex',
          width: `${SLIDES.length * 100}%`,
          height: '100%',
          transform: `translateX(-${(current * 100) / SLIDES.length}%)`,
          transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.18, 1)',
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
              backgroundPosition: 'center 10%',
            }}
          />
        ))}
      </div>

      {/* ── Gradient : bas sombre + gauche sombre ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.1) 65%, transparent 100%)`,
        }}
      />

      {/* ── Texte positionné en bas ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          padding: 'clamp(20px, 5vw, 56px)',
          paddingBottom: 'clamp(64px, 11vw, 100px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
          zIndex: 2,
        }}
      >
        {/* Badge petit */}
        <p style={{
          fontSize: 'clamp(8px, 2vw, 10px)',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#C6A769',
          marginBottom: '10px',
          fontFamily: 'var(--font-inter), sans-serif',
        }}>
          — Collection 2026 · Maroc —
        </p>

        {/* Titre */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(2rem, 8vw, 4.5rem)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          marginBottom: '2px',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          Chaque
        </h1>

        {/* Script doré — une seule ligne */}
        <p style={{
          fontFamily: 'var(--font-allura), cursive',
          fontSize: 'clamp(1.8rem, 6.5vw, 3.8rem)',
          color: '#C6A769',
          lineHeight: 1.1,
          marginBottom: '10px',
          textShadow: '0 2px 16px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}>
          seconde compte
        </p>

        {/* Sous-titre */}
        <p style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(10px, 3vw, 15px)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Portez-la avec style.
        </p>

        {/* Ligne dorée */}
        <div style={{ width: '40px', height: '1.5px', background: '#C6A769', marginBottom: '14px' }} />

        {/* Infos compactes */}
        <p style={{
          fontSize: 'clamp(9px, 2vw, 11px)',
          color: 'rgba(255,255,255,0.65)',
          fontFamily: 'var(--font-inter), sans-serif',
          letterSpacing: '0.04em',
          marginBottom: '22px',
          lineHeight: 1.7,
        }}>
          À partir de 149 MAD · Livraison gratuite · Paiement à la livraison
        </p>

        {/* CTA */}
        <div className="pointer-events-auto" style={{ display: 'flex', gap: '10px' }}>
          <Link href="/collection/femme" style={{
            padding: 'clamp(10px,2.5vw,14px) clamp(22px,5vw,36px)',
            background: '#C6A769', color: '#000',
            fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: 800,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            borderRadius: '2px', textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(198,167,105,0.35)',
            display: 'inline-block',
          }}>
            Femme
          </Link>
          <Link href="/collection/homme" style={{
            padding: 'clamp(10px,2.5vw,14px) clamp(22px,5vw,36px)',
            background: 'transparent', color: '#fff',
            fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: 800,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            borderRadius: '2px', textDecoration: 'none',
            border: '1.5px solid rgba(255,255,255,0.55)',
            display: 'inline-block',
          }}>
            Homme
          </Link>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full leading-none" style={{ zIndex: 3 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '60px' }}>
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="#FAF9F7" />
          <rect x="0" y="79" width="1440" height="2" fill="#FAF9F7" />
        </svg>
      </div>
    </section>
  )
}
