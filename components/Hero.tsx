'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  'https://res.cloudinary.com/dannr2e0c/image/upload/e_improve:60,e_contrast:30,e_brightness:-8,e_saturation:-20,e_vignette:55/v1778623885/luxtim/l9lsbiph4h9sck2lbrka.jpg'
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
              backgroundPosition: 'center 15%',
            }}
          />
        ))}
      </div>

      {/* ── Gradient gauche sombre → droite transparent ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%),
            linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Contenu texte ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end pointer-events-none"
        style={{
          padding: 'clamp(28px, 7vw, 64px)',
          paddingBottom: 'clamp(80px, 14vw, 120px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1s ease, transform 1s ease',
          zIndex: 2,
          maxWidth: '600px',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '1px', background: '#C6A769' }} />
          <span style={{
            fontSize: 'clamp(8px, 1.8vw, 10px)',
            fontWeight: 700,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#C6A769',
            fontFamily: 'var(--font-inter), sans-serif',
          }}>
            Collection 2026 · Maroc
          </span>
          <div style={{ width: '32px', height: '1px', background: '#C6A769' }} />
        </div>

        {/* Titre ligne 1 */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: '4px',
          textShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}>
          Chaque
        </h1>

        {/* Script doré */}
        <div style={{
          fontFamily: 'var(--font-allura), cursive',
          fontSize: 'clamp(2.2rem, 7vw, 4rem)',
          fontWeight: 400,
          color: '#C6A769',
          lineHeight: 1.1,
          marginBottom: '8px',
          textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
        }}>
          seconde compte
        </div>

        {/* Sous-titre */}
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(1rem, 3.5vw, 1.8rem)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.2,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>
          Portez-la avec style.
        </h2>

        {/* Ligne dorée */}
        <div style={{ width: '48px', height: '2px', background: '#C6A769', marginBottom: '20px' }} />

        {/* Infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '32px' }}>
          {[
            '✦  À partir de 149 MAD',
            '✦  Livraison gratuite partout au Maroc',
            '✦  Paiement à la livraison',
          ].map((line) => (
            <p key={line} style={{
              fontSize: 'clamp(10px, 2.2vw, 12px)',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-inter), sans-serif',
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="pointer-events-auto" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/collection/femme" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: 'clamp(12px,2.5vw,16px) clamp(24px,5vw,40px)',
            background: '#C6A769', color: '#000',
            fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            borderRadius: '2px', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(198,167,105,0.4)',
          }}>
            Femme
          </Link>
          <Link href="/collection/homme" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: 'clamp(12px,2.5vw,16px) clamp(24px,5vw,40px)',
            background: 'transparent', color: '#fff',
            fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            borderRadius: '2px', textDecoration: 'none',
            border: '1.5px solid rgba(255,255,255,0.6)',
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
