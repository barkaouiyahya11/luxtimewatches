'use client'

import { useState, useEffect, useRef } from 'react'

const VIDEO_URL = 'https://res.cloudinary.com/dannr2e0c/video/upload/v1778694272/luxtim/fdskrvsyr1brpnoeijet.mp4'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true

    const onEnded = () => {
      video.currentTime = 0
      video.play().catch(() => {})
    }
    video.addEventListener('ended', onEnded)

    const doPlay = () => video.play().catch(() => {})
    doPlay()

    const tryPlay = () => doPlay()
    window.addEventListener('touchstart', tryPlay, { once: true })
    window.addEventListener('click', tryPlay, { once: true })

    return () => {
      video.removeEventListener('ended', onEnded)
      window.removeEventListener('touchstart', tryPlay)
      window.removeEventListener('click', tryPlay)
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        aspectRatio: '4/5',
        maxHeight: '92vh',
        display: 'block',
        lineHeight: 0,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        isolation: 'isolate',
        background: '#080808',
      }}
    >
      {/* ── Vidéo fond ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
        src={VIDEO_URL}
      />

      {/* ── Couche cinématique : gauche sombre + bas sombre ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            linear-gradient(to right,  rgba(4,4,4,0.82) 0%, rgba(4,4,4,0.55) 42%, rgba(4,4,4,0.15) 65%, transparent 100%),
            linear-gradient(to top,    rgba(4,4,4,0.70) 0%, rgba(4,4,4,0.20) 30%, transparent 60%),
            linear-gradient(to bottom, rgba(4,4,4,0.35) 0%, transparent 22%)
          `,
        }}
      />

      {/* ── Texte luxe — centré verticalement à gauche ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(22px)',
          transition: 'opacity 1.1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        <div style={{
          padding: 'clamp(24px, 6vw, 64px)',
          paddingRight: 'clamp(20px, 5vw, 40px)',
          maxWidth: 'clamp(260px, 58vw, 540px)',
          lineHeight: 1,
        }}>

          {/* ── Ligne décorative fine ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: 'clamp(14px, 3vw, 22px)',
          }}>
            <div style={{ width: 'clamp(22px, 4vw, 36px)', height: '1px', background: '#C8A96B', opacity: 0.8 }} />
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 'clamp(7px, 1.4vw, 9.5px)',
              fontWeight: 600,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: '#C8A96B',
              opacity: 0.9,
              whiteSpace: 'nowrap',
            }}>
              Collection Exclusive 2026 · Maroc
            </p>
            <div style={{ width: 'clamp(22px, 4vw, 36px)', height: '1px', background: '#C8A96B', opacity: 0.8 }} />
          </div>

          {/* ── Grand titre principal ── */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.4rem, 8.5vw, 5.2rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#F5F2ED',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(2px, 0.5vw, 6px)',
            textShadow: '0 4px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            L&apos;élégance
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.4rem, 8.5vw, 5.2rem)',
            fontWeight: 900,
            fontStyle: 'normal',
            color: '#F5F2ED',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(14px, 3vw, 24px)',
            textShadow: '0 4px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            à votre poignet
          </h1>

          {/* ── Script doré ── */}
          <p style={{
            fontFamily: 'var(--font-allura), cursive',
            fontSize: 'clamp(1.5rem, 5.5vw, 3rem)',
            color: '#C8A96B',
            lineHeight: 1.2,
            marginBottom: 'clamp(16px, 3.5vw, 28px)',
            textShadow: '0 2px 24px rgba(200,169,107,0.35)',
            letterSpacing: '0.01em',
          }}>
            Le luxe qui attire les regards.
          </p>

          {/* ── Ligne dorée fine ── */}
          <div style={{
            width: 'clamp(32px, 6vw, 52px)',
            height: '1px',
            background: 'linear-gradient(to right, #C8A96B, transparent)',
            marginBottom: 'clamp(14px, 3vw, 22px)',
            opacity: 0.8,
          }} />

          {/* ── Slogan uppercase ── */}
          <p style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: 'clamp(7px, 1.5vw, 9px)',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#B8B8B8',
            marginBottom: 'clamp(10px, 2.5vw, 18px)',
            opacity: 0.85,
          }}>
            Design Intemporel • Finitions Premium
          </p>

          {/* ── Info livraison ── */}
          <p style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: 'clamp(8px, 1.6vw, 10px)',
            color: 'rgba(184,184,184,0.65)',
            letterSpacing: '0.06em',
            lineHeight: 1.6,
          }}>
            Livraison offerte partout au Maroc · Paiement à la livraison
          </p>

        </div>
      </div>

      {/* ── Vague de transition bas ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 3, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '52px' }}>
          <path d="M0,35 C400,75 1040,0 1440,42 L1440,70 L0,70 Z" fill="#FAF9F7" />
        </svg>
      </div>
    </section>
  )
}
