'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  'https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png',
  'https://i.ibb.co/cS4b03NR/Chat-GPT-Image-26-mars-2026-16-09-41.png',
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDES.length)
        setFading(false)
      }, 800)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '92vh', minHeight: 400, maxHeight: 900 }}
    >
      {/* Background image with fade transition */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${SLIDES[current]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* Subtle dark overlay for depth */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Dot indicators */}
      <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-500"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#ffffff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Wave bottom curve */}
      <div className="absolute bottom-0 left-0 w-full z-20 leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '70px' }}
        >
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  )
}
