'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  'https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png',
  'https://i.ibb.co/cS4b03NR/Chat-GPT-Image-26-mars-2026-16-09-41.png',
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="hero-container relative w-full overflow-hidden"
      style={{
        aspectRatio: '4/5',
        maxHeight: '90vh',
        marginBottom: 0,
        display: 'block',
        lineHeight: 0,
      }}
    >
      {/* ── Slide track ── */}
      <div
        style={{
          display: 'flex',
          width: `${SLIDES.length * 100}%`,
          height: '100%',
          transform: `translateX(-${(current * 100) / SLIDES.length}%)`,
          transition: 'transform 1s cubic-bezier(0.77, 0, 0.18, 1)',
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
              backgroundPosition: 'center center',
            }}
          />
        ))}
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.20) 100%)',
        }}
      />

      {/* Wave bottom curve */}
      <div className="absolute bottom-0 left-0 w-full leading-none" style={{ zIndex: 3 }}>
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '60px' }}
        >
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="#FAF9F7" />
          <rect x="0" y="79" width="1440" height="2" fill="#FAF9F7" />
        </svg>
      </div>
    </section>
  )
}
