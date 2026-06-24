'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const STATS = [
  { end: 500, suffix: '+', label: 'Commandes livrées' },
  { end: 48, suffix: 'h', label: 'Livraison max' },
  { end: 100, suffix: '%', label: 'Paiement sécurisé' },
]

const TRUST_ITEMS = [
  {
    icon: 'fa-truck-fast',
    title: 'Livraison Gratuite',
    desc: 'Partout au Maroc sous 24/48h.',
  },
  {
    icon: 'fa-handshake-angle',
    title: 'Paiement à la Livraison',
    desc: 'Payez à réception, 100% sécurisé.',
  },
  {
    icon: 'fa-medal',
    title: 'Qualité Premium',
    desc: 'Sélection rigoureuse, garantie produit.',
  },
]

function Counter({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let frame: number
    const duration = 1600
    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [end, started])

  return (
    <span>
      {count}{suffix}
    </span>
  )
}

export default function TrustSection() {
  const [countersStarted, setCountersStarted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  useScrollReveal()

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

        {/* Title */}
        <p className="title-reveal" style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#C6A769', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
          Notre Engagement
        </p>
        <h2 className="title-reveal title-reveal-d1" style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '48px' }}>
          L&apos;Excellence Lux Time
        </h2>

        {/* Stats compteurs */}
        <div
          ref={statsRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '56px' }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="stat-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                color: '#1A1A1A',
                lineHeight: 1,
              }}>
                <Counter end={s.end} suffix={s.suffix} started={countersStarted} />
              </div>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A769', fontWeight: 600 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="gold-line-anim" style={{ width: '40px', height: '1px', background: '#C6A769', margin: '0 auto 48px' }} />

        {/* Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.title} className="title-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', transitionDelay: `${i * 0.12}s` }}>
              <div style={{
                width: '56px', height: '56px',
                border: '1px solid #E5E5E5',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff',
              }}>
                <i className={`fa-solid ${item.icon}`} style={{ fontSize: '18px', color: '#C6A769' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A1A1A', marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '11px', color: '#6E6E6E', letterSpacing: '0.02em', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
