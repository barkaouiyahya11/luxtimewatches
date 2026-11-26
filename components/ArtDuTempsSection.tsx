'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────
   L'ART DU TEMPS — section éditoriale style haute horlogerie
   Fond vert profond, accents or, grandes images plein écran.
   Visuels générés avec Higgsfield (public/art/).
───────────────────────────────────────────── */

const GREEN = '#0b1f17'
const GOLD = '#C8A96B'

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, shown }
}

function reveal(shown: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 1.1s ease ${delay}s, transform 1.1s ease ${delay}s`,
  }
}

const DETAILS = [
  {
    img: '/art/mouvement.jpg',
    alt: 'Mouvement de montre en or, vue macro',
    tag: 'Précision',
    title: 'Le cœur de chaque montre',
    text: 'Engrenages, rubis et finitions soignées : nous choisissons chaque pièce pour sa fiabilité et sa beauté.',
  },
  {
    img: '/art/ecrin.jpg',
    alt: 'Montre or et acier dans un écrin de velours vert',
    tag: 'Présentation',
    title: 'Un écrin digne de vous',
    text: 'Chaque commande arrive soigneusement emballée, prête à offrir ou à porter dès le premier jour.',
  },
]

export default function ArtDuTempsSection() {
  const hero = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()

  return (
    <section id="art-du-temps" style={{ background: GREEN, color: '#f5efe3' }} aria-label="L'art du temps">
      {/* ── Bandeau plein écran ── */}
      <div
        ref={hero.ref}
        className="art-hero"
        style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      >
        <Image
          src="/art/cadran.jpg"
          alt="Cadran vert et lunette or, gros plan"
          fill
          sizes="100vw"
          quality={85}
          style={{
            objectFit: 'cover',
            objectPosition: '78% center',
            transform: hero.shown ? 'scale(1)' : 'scale(1.08)',
            transition: 'transform 2.4s cubic-bezier(.2,.7,.2,1)',
          }}
        />
        <div className="art-hero-shade" style={{ position: 'absolute', inset: 0 }} />
        <div className="art-hero-text" style={{ position: 'absolute', zIndex: 2 }}>
          <p
            style={{
              ...reveal(hero.shown, 0.2),
              fontSize: 11,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: GOLD,
              margin: 0,
            }}
          >
            Gushkin · Maroc
          </p>
          <h2
            className="font-serif"
            style={{
              ...reveal(hero.shown, 0.4),
              fontSize: 'clamp(2.2rem, 6vw, 4.8rem)',
              lineHeight: 1.05,
              fontWeight: 400,
              margin: '18px 0 0',
            }}
          >
            L&apos;Art
            <br />
            du Temps
          </h2>
          <div
            style={{
              ...reveal(hero.shown, 0.6),
              width: 56,
              height: 1,
              background: GOLD,
              margin: '26px 0',
            }}
          />
          <p
            style={{
              ...reveal(hero.shown, 0.75),
              maxWidth: 360,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(245,239,227,0.8)',
              margin: 0,
            }}
          >
            Des montres choisies pour leur élégance intemporelle. Un style qui se remarque, à un prix
            qui vous ressemble.
          </p>
          <button
            onClick={() =>
              document.getElementById('coll-homme')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="art-btn"
            style={{ ...reveal(hero.shown, 0.9), marginTop: 32 }}
          >
            Découvrir la collection
          </button>
        </div>
      </div>

      {/* ── Détails : deux images éditoriales ── */}
      <div
        ref={grid.ref}
        className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 grid gap-14 md:gap-10 md:grid-cols-2"
      >
        {DETAILS.map((d, i) => (
          <article key={d.img} style={reveal(grid.shown, 0.2 + i * 0.25)}>
            <div
              className="art-card-img"
              style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}
            >
              <Image
                src={d.img}
                alt={d.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: GOLD,
                margin: '26px 0 0',
              }}
            >
              {d.tag}
            </p>
            <h3 className="font-serif" style={{ fontSize: 26, fontWeight: 400, margin: '10px 0 12px' }}>
              {d.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(245,239,227,0.72)', margin: 0 }}>
              {d.text}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .art-hero { height: 88vh; min-height: 520px; max-height: 860px; }
        .art-hero-shade { background: linear-gradient(90deg, rgba(5,15,10,0.92) 0%, rgba(5,15,10,0.65) 40%, rgba(5,15,10,0) 70%); }
        .art-hero-text { left: 8%; top: 50%; transform: translateY(-50%); max-width: 460px; }
        .art-btn {
          background: transparent; color: #f5efe3; border: 1px solid ${GOLD};
          padding: 14px 30px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer;
          transition: background .35s ease, color .35s ease, opacity 1.1s ease .9s, transform 1.1s ease .9s;
        }
        .art-btn:hover { background: ${GOLD}; color: ${GREEN}; }
        .art-card-img img { transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
        .art-card-img:hover img { transform: scale(1.05); }
        @media (max-width: 767px) {
          .art-hero { height: 92vh; }
          .art-hero-shade { background: linear-gradient(0deg, rgba(5,15,10,0.95) 0%, rgba(5,15,10,0.6) 45%, rgba(5,15,10,0.1) 75%); }
          .art-hero-text { left: 6%; right: 6%; top: auto; bottom: 9%; transform: none; }
        }
      `}</style>
    </section>
  )
}
