'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  'https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png',
  'https://i.ibb.co/cS4b03NR/Chat-GPT-Image-26-mars-2026-16-09-41.png',
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [nextSlide, setNextSlide] = useState<number | null>(null)
  const [revealing, setRevealing] = useState(false)

  function goTo(idx: number) {
    if (idx === current || revealing) return
    setNextSlide(idx)
    setRevealing(false)
    // Let DOM mount the hidden layer first, then trigger reveal
    setTimeout(() => setRevealing(true), 30)
    // After transition ends, swap current
    setTimeout(() => {
      setCurrent(idx)
      setNextSlide(null)
      setRevealing(false)
    }, 1350)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % SLIDES.length
      goTo(next)
    }, 5500)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, revealing])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '92vh', minHeight: 400, maxHeight: 900 }}
    >
      {/* ── Current image (stays in place, slight slow zoom) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${SLIDES[current]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'heroZoom 6s ease-in-out forwards',
        }}
      />

      {/* ── Incoming image — revealed left→right with parallax ── */}
      {nextSlide !== null && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${SLIDES[nextSlide]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            /* Mask reveal: starts fully hidden (right clipped), opens to full */
            clipPath: revealing ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
            /* Parallax: starts pushed right, slides to neutral */
            transform: revealing ? 'translateX(0%)' : 'translateX(6%)',
            transition: revealing
              ? 'clip-path 1.2s cubic-bezier(0.77,0,0.18,1), transform 1.4s cubic-bezier(0.77,0,0.18,1)'
              : 'none',
          }}
        />
      )}

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background:
                i === current ? '#ffffff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.5s ease',
            }}
          />
        ))}
      </div>

      {/* ── Wave bottom curve ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 leading-none">
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

      {/* ── Keyframe for slow zoom on current image ── */}
      <style>{`
        @keyframes heroZoom {
          from { background-size: 105%; }
          to   { background-size: 100%; }
        }
      `}</style>
    </section>
  )
}
