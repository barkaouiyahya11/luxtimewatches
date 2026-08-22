'use client'

import { useState, useEffect, useRef } from 'react'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  // ── Parallax : texte + indicateur scroll ──
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY

      // Texte — disparaît et monte légèrement
      if (textRef.current) {
        const opacity = Math.max(0, 1 - scrolled / 350)
        textRef.current.style.opacity = String(opacity)
        textRef.current.style.transform = `translateY(${-scrolled * 0.15}px)`
      }

      // Indicateur scroll — disparaît vite
      if (scrollLineRef.current) {
        scrollLineRef.current.style.opacity = String(Math.max(0, 1 - scrolled / 120))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      aspectRatio: '4/5',
      maxHeight: '92vh',
      display: 'block',
      lineHeight: 0,
      background: '#060606',
      isolation: 'isolate',
    }}>

      {/* ── Image hero + Ken Burns ── */}
      <img
        src="https://res.cloudinary.com/dannr2e0c/image/upload/e_trim:15/c_fill,g_center/v1786236179/luxtim/hero_watches.jpg"
        alt="Collection Gushkin"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          transformOrigin: 'center center',
        }}
      />

      {/* ── Overlay léger en haut ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%)',
      }} />


      {/* ── Indicateur scroll (ligne animée) — comme Rolex ── */}
      <div
        ref={scrollLineRef}
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.5s ease 1s',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontSize: '8px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(200,169,107,0.7)',
          fontWeight: 500,
          margin: 0,
        }}>
          Scroll
        </p>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, #C8A96B, transparent)',
          animation: 'scrollLine 1.8s ease-in-out infinite',
        }} />
      </div>

    </section>
  )
}
