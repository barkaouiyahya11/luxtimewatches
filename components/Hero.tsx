'use client'

import { useState, useEffect, useRef } from 'react'

const VIDEO_URL = 'https://res.cloudinary.com/dannr2e0c/video/upload/v1778694272/luxtim/fdskrvsyr1brpnoeijet.mp4'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
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
    window.addEventListener('touchstart', doPlay, { once: true })
    window.addEventListener('click',      doPlay, { once: true })

    return () => {
      video.removeEventListener('ended', onEnded)
      window.removeEventListener('touchstart', doPlay)
      window.removeEventListener('click',      doPlay)
    }
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

      {/* ── Vidéo + Ken Burns ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
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

      {/* ── Bloc texte centré — stagger par élément ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          paddingLeft: 'clamp(22px, 7vw, 64px)',
          paddingRight: 'clamp(16px, 4vw, 32px)',
          maxWidth: 'clamp(230px, 62vw, 520px)',
        }}>

          {/* Badge — apparaît en 1er */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'clamp(16px, 4.5vw, 28px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.05s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.05s',
          }}>
            <div style={{ width: 'clamp(18px,4vw,30px)', height: '0.5px', background: '#C8A96B', opacity: 0.7 }} />
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
            <div style={{ width: 'clamp(18px,4vw,30px)', height: '0.5px', background: '#C8A96B', opacity: 0.7 }} />
          </div>

          {/* Titre ligne 1 — delay 0.2s */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: '0.06em',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.95s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}>
            L&apos;élégance
          </h1>

          {/* Titre ligne 2 — delay 0.34s */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 800,
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: '0.06em',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.95s cubic-bezier(0.22,1,0.36,1) 0.34s, transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.34s',
          }}>
            à votre
          </h1>

          {/* Titre ligne 3 — delay 0.48s */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.1rem, 7.8vw, 5rem)',
            fontWeight: 800,
            color: '#F5F2ED',
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: 'clamp(14px, 4vw, 26px)',
            textShadow: '0 2px 32px rgba(0,0,0,0.55)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.95s cubic-bezier(0.22,1,0.36,1) 0.48s, transform 0.95s cubic-bezier(0.22,1,0.36,1) 0.48s',
          }}>
            poignet
          </h1>

          {/* Séparateur — delay 0.62s */}
          <div style={{
            width: 'clamp(28px, 6vw, 44px)',
            height: '0.5px',
            background: 'linear-gradient(to right, #C8A96B 60%, transparent)',
            marginBottom: 'clamp(10px, 3vw, 18px)',
            opacity: visible ? 0.75 : 0,
            transition: 'opacity 0.8s ease 0.62s',
          }} />

          {/* Script Great Vibes — delay 0.74s */}
          <p style={{
            fontFamily: 'var(--font-great-vibes), cursive',
            fontSize: 'clamp(1.3rem, 4.8vw, 2.6rem)',
            color: '#C8A96B',
            lineHeight: 1.3,
            letterSpacing: '0.02em',
            textShadow: '0 2px 18px rgba(200,169,107,0.25)',
            margin: 0,
            opacity: visible ? 0.88 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1s cubic-bezier(0.22,1,0.36,1) 0.74s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.74s',
          }}>
            Le luxe qui attire les regards.
          </p>

        </div>
      </div>

      {/* ── Fade noir élégant en bas — remplace la vague ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28%',
        zIndex: 3,
        pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(250,249,247,1) 0%, rgba(250,249,247,0.6) 40%, transparent 100%)',
      }} />

    </section>
  )
}
