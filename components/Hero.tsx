'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    img: 'https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png',
    title: "L'ÉLÉGANCE",
    subtitle: 'INTEMPORELLE',
    cta: 'VOIR LA COLLECTION',
    href: '/collection/femme',
  },
  {
    img: 'https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png',
    title: 'LUXE &',
    subtitle: 'PRESTIGE',
    cta: 'COLLECTION HOMME',
    href: '/collection/homme',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length)
  const slide = SLIDES[current]

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden" style={{ minHeight: 400 }}>
      {/* Background image */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url('${slide.img}') no-repeat center center / cover`,
        }}
      />

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4 font-semibold text-white/80">LUX TIME · MAROC</p>
        <h1 className="font-serif font-black text-5xl md:text-8xl uppercase leading-none mb-2">
          {slide.title}
        </h1>
        <h2 className="font-serif font-black text-5xl md:text-8xl uppercase leading-none mb-8">
          {slide.subtitle}
        </h2>
        <Link
          href={slide.href}
          className="border-2 border-white text-white text-[10px] font-black uppercase tracking-widest px-10 py-3 hover:bg-white hover:text-black transition-all duration-300"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white border border-white/50 hover:border-white hover:bg-white/10 transition text-lg"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white border border-white/50 hover:border-white hover:bg-white/10 transition text-lg"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
