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
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="hero-container relative w-full overflow-hidden"
      style={{ height: '92vh', minHeight: 400, maxHeight: 900 }}
    >
      {/* Ken Burns keyframes */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.00); }
          100% { transform: scale(1.10); }
        }
      `}</style>

      {/* All slides stacked — only active one is visible */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: i === current ? 1 : 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${src}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              /* Ken Burns: restart animation every time this slide becomes active */
              animation: i === current ? 'kenBurns 8s ease-in-out forwards' : 'none',
            }}
          />
        </div>
      ))}

      {/* Subtle vignette for premium depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.30) 100%)',
          zIndex: 2,
        }}
      />

      {/* Wave bottom curve */}
      <div
        className="absolute bottom-0 left-0 w-full leading-none"
        style={{ zIndex: 3 }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '70px' }}
        >
          <path
            d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  )
}
