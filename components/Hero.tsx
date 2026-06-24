'use client'

import { useState, useEffect, useRef } from 'react'

const VIDEO_URL = 'https://res.cloudinary.com/dannr2e0c/video/upload/v1778694272/luxtim/fdskrvsyr1brpnoeijet.mp4'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  // ── Parallax : fond + texte + indicateur scroll ──
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY

      // Fond vidéo — bouge à 40% de la vitesse (comme Rolex)
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.40}px)`
      }

      // Texte — disparaît et monte légèrement
      if (textRef.current) {
        const opacity = Math.max(0, 1 - scrolled / 350)
        const translateY = -scrolled * 0.18
        textRef.current.style.opacity = String(opacity)
        textRef.current.style.transform = `translateY(${translateY}px)`
      }

      // Indicateur scroll — disparaît vite
      if (scrollLineRef.current) {
        scrollLineRef.current.style.opacity = String(Math.max(0, 1 - scrolled / 120))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
    const onVisibility = () => {
      if (!document.hidden) video.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
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

      {/* ── Vidéo + Ken Burns + Parallax ── */}
      <div
        ref={parallaxRef}
        style={{
          position: 'absolute',
          inset: '-18% 0 -18% 0',
          willChange: 'transform',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          className="hero-video-kenburns"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transformOrigin: 'center center',
          }}
          src={VIDEO_URL}
        />
      </div>

      {/* ── Overlay transparent pour bloquer les contrôles TikTok browser ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'auto',
        background: 'transparent',
      }} />

      {/* ── Overlay cinématique premium ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `
          linear-gradient(to right,
            rgba(3,3,3,0.88) 0%,
            rgba(3,3,3,0.60) 38%,
            rgba(3,3,3,0.22) 58%,
            transparent 78%
          ),
          linear-gradient(to bottom,
            rgba(3,3,3,0.42) 0%,
            transparent 28%
          ),
          linear-gradient(to top,
            rgba(3,3,3,0.95) 0%,
            rgba(3,3,3,0.30) 22%,
            transparent 45%
          )
        `,
      }} />

      {/* ── Bloc texte avec parallax inversé ── */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(18px)',
          transition: visible
            ? 'opacity 1.3s cubic-bezier(0.22,1,0.36,1), transform 1.3s cubic-bezier(0.22,1,0.36,1)'
            : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{
          paddingLeft: 'clamp(22px, 7vw, 64px)',
          paddingRight: 'clamp(16px, 4vw, 32px)',
          maxWidth: 'clamp(230px, 62vw, 520px)',
        }}>

          {/* Badge collection */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'clamp(18px, 5vw, 32px)',
          }}>
            <div style={{ width: 'clamp(18px, 4vw, 30px)', height: '0.5px', background: '#C8A96B', opacity: 0.7 }} />
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 'clamp(6.5px, 1.6vw, 9px)',
              fontWeight: 500,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: '#C8A96B',
              opacity: 0.85,
              whiteSpace: 'nowrap',
            }}>
              Collection Exclusive 2026 · Maroc
            </p>
            <div style={{ width: 'clamp(18px, 4vw, 30px)', height: '0.5px', background: '#C8A96B', opacity: 0.7 }} />
          </div>

          {/* Grand titre */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: '0.08em',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
          }}>
            L&apos;élégance
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 800,
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: '0.08em',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
          }}>
            à votre
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 800,
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: 'clamp(16px, 4.5vw, 30px)',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
          }}>
            poignet
          </h1>

          <div style={{
            width: 'clamp(28px, 6vw, 44px)',
            height: '0.5px',
            background: 'linear-gradient(to right, #C8A96B 60%, transparent)',
            marginBottom: 'clamp(12px, 3.5vw, 22px)',
            opacity: 0.75,
          }} />

          <p style={{
            fontFamily: 'var(--font-great-vibes), cursive',
            fontSize: 'clamp(1.3rem, 4.8vw, 2.6rem)',
            color: '#C8A96B',
            lineHeight: 1.3,
            letterSpacing: '0.02em',
            opacity: 0.88,
            textShadow: '0 2px 18px rgba(200,169,107,0.25)',
            marginBottom: 0,
          }}>
            Le luxe qui attire les regards.
          </p>

        </div>
      </div>

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
