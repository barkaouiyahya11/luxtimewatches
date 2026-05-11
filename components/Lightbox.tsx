'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function Lightbox({ images, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  // Touch refs
  const lastDist = useRef<number | null>(null)
  const lastCenter = useRef<{ x: number; y: number } | null>(null)
  const baseTranslate = useRef({ x: 0, y: 0 })
  const baseScale = useRef(1)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isSingleFinger = useRef(false)

  // Fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') nav(-1)
      if (e.key === 'ArrowRight') nav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function close() {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  function resetZoom() {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }

  const nav = useCallback((dir: number) => {
    if (scale > 1) { resetZoom(); return }
    setIndex((i) => (i + dir + images.length) % images.length)
  }, [scale, images.length])

  // ── Touch: pinch-to-zoom + pan + swipe-to-close ──────────
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isSingleFinger.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastDist.current = Math.hypot(dx, dy)
      lastCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      }
      baseTranslate.current = { x: translate.x, y: translate.y }
      baseScale.current = scale
    } else {
      isSingleFinger.current = true
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      if (scale > 1) {
        baseTranslate.current = { x: translate.x, y: translate.y }
        lastCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault()
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      if (lastDist.current) {
        const ratio = dist / lastDist.current
        const next = Math.min(Math.max(baseScale.current * ratio, 1), 5)
        setScale(next)
        baseScale.current = next
      }
      lastDist.current = dist
    } else if (e.touches.length === 1 && scale > 1 && lastCenter.current) {
      const dx = e.touches[0].clientX - lastCenter.current.x
      const dy = e.touches[0].clientY - lastCenter.current.y
      setTranslate({
        x: baseTranslate.current.x + dx,
        y: baseTranslate.current.y + dy,
      })
      baseTranslate.current = {
        x: baseTranslate.current.x + dx,
        y: baseTranslate.current.y + dy,
      }
      lastCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    lastDist.current = null
    if (scale < 1.15) resetZoom()

    if (isSingleFinger.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartX.current
      const dy = e.changedTouches[0].clientY - touchStartY.current

      // Swipe down → close
      if (dy > 90 && Math.abs(dx) < 60 && scale <= 1) {
        close(); return
      }
      // Swipe left/right → navigate
      if (Math.abs(dx) > 60 && Math.abs(dy) < 60 && scale <= 1) {
        nav(dx < 0 ? 1 : -1)
      }
    }
  }

  const img = images[index]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: `rgba(0,0,0,${visible ? 0.96 : 0})`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.25s ease',
      }}
      onClick={() => scale <= 1 && close()}
    >
      {/* ── Close button ── */}
      <button
        onClick={(e) => { e.stopPropagation(); close() }}
        style={{
          position: 'absolute', top: '16px', right: '16px',
          width: '44px', height: '44px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          color: '#fff', fontSize: '18px',
          cursor: 'pointer', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* ── Counter ── */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.15em', zIndex: 10,
        }}>
          {index + 1} / {images.length}
        </div>
      )}

      {/* ── Zoom indicator ── */}
      {scale > 1.1 && (
        <div
          onClick={(e) => { e.stopPropagation(); resetZoom() }}
          style={{
            position: 'absolute', top: '20px', left: '20px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            color: '#fff', fontSize: '10px', fontWeight: 700,
            padding: '6px 14px', cursor: 'pointer', zIndex: 10,
            letterSpacing: '0.1em',
          }}
        >
          {scale.toFixed(1)}× — Réinitialiser
        </div>
      )}

      {/* ── Image ── */}
      <div
        style={{
          maxWidth: '90vw', maxHeight: '80vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          cursor: scale > 1 ? 'grab' : 'default',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={img}
          src={img}
          alt=""
          draggable={false}
          style={{
            maxWidth: '90vw',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: scale === 1 ? 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease' : 'none',
            opacity: visible ? 1 : 0,
            userSelect: 'none',
            touchAction: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>

      {/* ── Nav arrows (desktop) ── */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); nav(-1) }}
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '48px', height: '48px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', color: '#fff', fontSize: '20px',
              cursor: 'pointer', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nav(1) }}
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '48px', height: '48px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', color: '#fff', fontSize: '20px',
              cursor: 'pointer', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
          >
            ›
          </button>
        </>
      )}

      {/* ── Thumbnails bar ── */}
      {images.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: '20px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '8px',
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '40px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              onClick={() => { setIndex(i); resetZoom() }}
              style={{
                width: '48px', height: '48px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: i === index
                  ? '2px solid #C6A769'
                  : '2px solid rgba(255,255,255,0.15)',
                transition: 'border-color 0.2s, transform 0.2s',
                transform: i === index ? 'scale(1.08)' : 'scale(1)',
                opacity: i === index ? 1 : 0.65,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Mobile hint ── */}
      {images.length > 1 && (
        <p style={{
          position: 'absolute', bottom: '88px', left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '10px', fontWeight: 500,
          letterSpacing: '0.1em', whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
        className="md:hidden"
        >
          ← Glisser pour naviguer · Pincer pour zoomer →
        </p>
      )}
    </div>
  )
}
