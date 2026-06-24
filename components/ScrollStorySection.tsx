'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   ROLEX-STYLE SCROLL STORY
   La section fait 400vh de haut.
   L'intérieur est "sticky" : il reste collé en haut
   pendant que l'utilisateur scrolle à travers 400vh.
   On calcule un "progress" de 0 à 1 et on anime
   chaque élément selon sa position dans le scroll.
───────────────────────────────────────────── */

const SLIDES = [
  {
    img: 'https://res.cloudinary.com/dannr2e0c/image/upload/v1778605612/luxtim/iqsbse8qwyvfzon98le4.jpg',
    tag: 'Collection Exclusive 2026',
    title: 'Précision\n& Élégance',
    sub: 'Chaque détail est une déclaration de style.',
  },
  {
    img: 'https://res.cloudinary.com/dannr2e0c/image/upload/v1778594659/luxtim/no6n6ecvcz9azmiprzjd.jpg',
    tag: 'Artisanat Premium',
    title: 'Le Luxe\nà Votre Poignet',
    sub: 'Montres sélectionnées pour leur excellence absolue.',
  },
  {
    img: 'https://res.cloudinary.com/dannr2e0c/image/upload/v1778598063/luxtim/smntpxy7kfgqjo53exdq.jpg',
    tag: 'Gushkin · Maroc',
    title: 'Définissez\nVotre Style',
    sub: 'Livraison gratuite partout au Maroc sous 48h.',
  },
]

/* Interpolation linéaire entre deux valeurs */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

/* Normalise le progress entre [start, end] → [0, 1] */
function norm(p: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)))
}

export default function ScrollStorySection() {
  const wrapRef   = useRef<HTMLDivElement>(null)   // section 400vh
  const stickyRef = useRef<HTMLDivElement>(null)   // sticky 100vh

  // Refs pour chaque slide
  const imgRefs  = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const tagRefs  = useRef<(HTMLSpanElement | null)[]>([])

  // Indicateur de progression
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current
      if (!wrap) return

      const rect     = wrap.getBoundingClientRect()
      const wrapH    = wrap.offsetHeight
      const vh       = window.innerHeight

      /* progress = 0 quand le haut de la section touche le haut de l'écran
         progress = 1 quand le bas de la section quitte l'écran */
      const progress = Math.max(0, Math.min(1, -rect.top / (wrapH - vh)))

      /* ─── Barre de progression dorée ─── */
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }

      /* ─── Chaque slide occupe 1/3 du progress total ─── */
      SLIDES.forEach((_, i) => {
        const start = i / SLIDES.length
        const end   = (i + 1) / SLIDES.length
        const mid   = (start + end) / 2

        /* Progress local à ce slide : 0 → 1 */
        const p = norm(progress, start, end)

        /* Fade de l'image : entre en douceur, sort en douceur */
        const imgOpacity = p < 0.15
          ? lerp(0, 1, p / 0.15)
          : p > 0.85
            ? lerp(1, 0, (p - 0.85) / 0.15)
            : 1

        /* Zoom lent sur l'image (1.0 → 1.12) — l'effet Ken Burns lié au scroll */
        const imgScale = lerp(1.0, 1.12, p)

        if (imgRefs.current[i]) {
          imgRefs.current[i]!.style.opacity = i === 0 && progress < start
            ? '1'
            : String(imgOpacity)
          imgRefs.current[i]!.style.transform = `scale(${imgScale})`
        }

        /* Texte : entre par la gauche, sort vers la droite */
        const textEnter = norm(p, 0, 0.25)
        const textExit  = norm(p, 0.75, 1)
        const textX     = p < 0.25
          ? lerp(-60, 0, textEnter)
          : p > 0.75
            ? lerp(0, 60, textExit)
            : 0
        const textOp    = p < 0.25
          ? textEnter
          : p > 0.75
            ? 1 - textExit
            : 1

        if (textRefs.current[i]) {
          textRefs.current[i]!.style.transform   = `translateX(${textX}px)`
          textRefs.current[i]!.style.opacity      = String(textOp)
        }

        /* Tag : entre légèrement après le titre */
        const tagEnter = norm(p, 0.1, 0.3)
        const tagExit  = norm(p, 0.75, 1)
        const tagOp    = p < 0.3 ? tagEnter : p > 0.75 ? 1 - tagExit : 1
        if (tagRefs.current[i]) {
          tagRefs.current[i]!.style.opacity = String(tagOp)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // état initial
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    /* ── Conteneur 400vh : crée l'espace de scroll ── */
    <div ref={wrapRef} style={{ height: '400vh', position: 'relative' }}>

      {/* ── Sticky : reste collé pendant tout le scroll ── */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#080808',
        }}
      >

        {/* ── Images empilées (une par slide) ── */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            ref={el => { imgRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: '-8% 0',
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === 0 ? 1 : 0,
              willChange: 'transform, opacity',
            }}
          />
        ))}

        {/* ── Overlay cinématique fixe ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%),
            linear-gradient(to top,    rgba(0,0,0,0.75) 0%, transparent 40%),
            linear-gradient(to right,  rgba(0,0,0,0.6)  0%, transparent 60%)
          `,
        }} />

        {/* ── Textes : un bloc par slide ── */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(28px, 6vw, 72px)',
              paddingBottom: 'clamp(60px, 10vh, 100px)',
              opacity: i === 0 ? 1 : 0,
              willChange: 'transform, opacity',
            }}
            ref={el => { textRefs.current[i] = el }}
          >
            {/* Tag */}
            <span
              ref={el => { tagRefs.current[i] = el }}
              style={{
                fontSize: 'clamp(8px, 1.5vw, 10px)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#C8A96B',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'block',
                opacity: i === 0 ? 1 : 0,
              }}
            >
              {slide.tag}
            </span>

            {/* Titre principal */}
            <h2 style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              fontWeight: 700,
              color: '#F5F2ED',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
              marginBottom: '20px',
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              whiteSpace: 'pre-line',
            }}>
              {slide.title}
            </h2>

            {/* Sous-titre */}
            <p style={{
              fontSize: 'clamp(11px, 1.8vw, 14px)',
              color: 'rgba(245,242,237,0.75)',
              letterSpacing: '0.05em',
              fontWeight: 400,
              maxWidth: '440px',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {slide.sub}
            </p>

            {/* Numéro du slide */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '32px',
            }}>
              <span style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(11px, 1.6vw, 13px)',
                color: '#C8A96B',
                fontWeight: 700,
              }}>
                0{i + 1}
              </span>
              <div style={{ width: '32px', height: '0.5px', background: '#C8A96B', opacity: 0.6 }} />
              <span style={{ fontSize: '10px', color: 'rgba(200,169,107,0.5)', letterSpacing: '0.2em' }}>
                0{SLIDES.length}
              </span>
            </div>
          </div>
        ))}

        {/* ── Barre de progression dorée en bas ── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(200,169,107,0.15)',
          zIndex: 3,
        }}>
          <div
            ref={barRef}
            style={{
              height: '100%',
              background: '#C8A96B',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              willChange: 'transform',
            }}
          />
        </div>

      </div>
    </div>
  )
}
