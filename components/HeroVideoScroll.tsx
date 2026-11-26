'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   HERO VIDÉO + EFFET AU SCROLL
   - Vidéo plein écran (générée avec Higgsfield) collée en haut (sticky).
   - En descendant : la vidéo s'assombrit et zoome légèrement,
     le titre s'efface, puis la Collection Homme arrive directement.
───────────────────────────────────────────── */

const GOLD = '#C8A96B'


function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function HeroVideoScroll() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.8))) // 0 → 1 sur le premier écran
      if (mediaRef.current) mediaRef.current.style.transform = `scale(${1 + p * 0.08})`
      if (shadeRef.current) shadeRef.current.style.opacity = String(0.25 + p * 0.6)
      if (textRef.current) {
        textRef.current.style.opacity = String(Math.max(0, 1 - p * 1.8))
        textRef.current.style.transform = `translateY(${-p * 60}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 5))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    /* marginTop négatif : la vidéo passe sous la barre d'annonce + l'en-tête (109px) */
    <section className="hvs" style={{ position: 'relative', background: '#050c08', marginTop: -109 }}>
      {/* ── Vidéo collée en haut ── */}
      <div className="hvs-sticky">
        <div ref={mediaRef} className="hvs-media">
          <video
            className="hvs-video"
            src="/art/hero-montre.mp4"
            poster="/art/hero-montre.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <div ref={shadeRef} className="hvs-shade" />

        <div ref={textRef} className="hvs-text">
          <p className="hvs-tag">Gushkin · Maroc</p>
          <h1 className="font-serif hvs-title">L&apos;Élégance du Temps</h1>
          <button className="hvs-btn" onClick={() => goTo('coll-homme')}>
            Découvrir
          </button>
        </div>

        <div ref={hintRef} className="hvs-hint">
          <span>Scroll</span>
          <i />
        </div>
      </div>


      <style>{`
        .hvs-sticky {
          position: sticky; top: 0; height: 100vh; height: 100svh;
          overflow: hidden; z-index: 0;
        }
        .hvs-media { position: absolute; inset: 0; will-change: transform; }
        .hvs-video { width: 100%; height: 100%; object-fit: cover; object-position: center 35%; display: block; }
        .hvs-shade { position: absolute; inset: 0; background: #000; opacity: .25; pointer-events: none; }
        .hvs-text {
          position: absolute; left: 0; right: 0; top: calc(109px + 5vh);
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 0 20px; color: #fff; will-change: transform, opacity;
        }
        .hvs-tag {
          font-size: 11px; letter-spacing: .4em; text-transform: uppercase;
          color: ${GOLD}; margin: 0 0 14px;
        }
        .hvs-title {
          font-size: clamp(2.1rem, 6vw, 4.6rem); font-weight: 400; line-height: 1.08;
          margin: 0; text-shadow: 0 2px 30px rgba(0,0,0,.5);
        }
        .hvs-btn {
          margin-top: 26px; padding: 11px 26px; border-radius: 999px;
          background: rgba(255,255,255,.14); color: #fff; border: 1px solid rgba(255,255,255,.35);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          font-size: 12px; letter-spacing: .08em; cursor: pointer;
          transition: background .3s ease, color .3s ease;
        }
        .hvs-btn:hover { background: ${GOLD}; color: #0b1f17; border-color: ${GOLD}; }
        .hvs-hint {
          position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none;
        }
        .hvs-hint span { font-size: 8px; letter-spacing: .3em; text-transform: uppercase; color: rgba(200,169,107,.75); }
        .hvs-hint i { display: block; width: 1px; height: 40px; background: linear-gradient(to bottom, ${GOLD}, transparent); animation: scrollLine 1.8s ease-in-out infinite; }


        @media (max-width: 767px) {
          .hvs-text { top: calc(109px + 4vh); }
          .hvs-btn { display: none; }
        }
      `}</style>
    </section>
  )
}
