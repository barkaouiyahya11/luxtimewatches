'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function Lightbox({ images, initialIndex = 0, onClose }: Props) {
  const [index] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  // Touch refs
  const lastDist = useRef<number | null>(null)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const baseTranslate = useRef({ x: 0, y: 0 })
  const baseScale = useRef(1)
  const isTwoFingers = useRef(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  function close() {
    setVisible(false)
    setTimeout(onClose, 220)
  }

  function resetZoom() {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }

  // ── Pinch-to-zoom + pan ──────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isTwoFingers.current = true
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastDist.current = Math.hypot(dx, dy)
      baseScale.current = scale
      baseTranslate.current = { x: translate.x, y: translate.y }
    } else if (e.touches.length === 1) {
      isTwoFingers.current = false
      if (scale > 1) {
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        baseTranslate.current = { x: translate.x, y: translate.y }
      }
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault()
    if (e.touches.length === 2 && lastDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const ratio = dist / lastDist.current
      const next = Math.min(Math.max(baseScale.current * ratio, 1), 6)
      setScale(next)
      baseScale.current = next
      lastDist.current = dist
    } else if (e.touches.length === 1 && scale > 1 && lastPos.current) {
      const dx = e.touches[0].clientX - lastPos.current.x
      const dy = e.touches[0].clientY - lastPos.current.y
      setTranslate({
        x: baseTranslate.current.x + dx,
        y: baseTranslate.current.y + dy,
      })
      baseTranslate.current = {
        x: baseTranslate.current.x + dx,
        y: baseTranslate.current.y + dy,
      }
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  function onTouchEnd() {
    lastDist.current = null
    lastPos.current = null
    if (scale < 1.1) resetZoom()
  }

  return (
    <div
      onClick={() => scale <= 1 && close()}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: `rgba(0,0,0,${visible ? 0.95 : 0})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.22s ease',
      }}
    >
      {/* ── Bouton fermer ── */}
      <button
        onClick={(e) => { e.stopPropagation(); close() }}
        style={{
          position: 'absolute', top: '16px', right: '16px',
          width: '44px', height: '44px',
          background: 'rgba(255,255,255,0.13)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: '50%', color: '#fff', fontSize: '18px',
          cursor: 'pointer', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* ── Indicateur zoom (desktop) ── */}
      {scale > 1.1 && (
        <button
          onClick={(e) => { e.stopPropagation(); resetZoom() }}
          style={{
            position: 'absolute', bottom: '20px', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.13)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', color: '#fff',
            fontSize: '10px', fontWeight: 700,
            padding: '7px 18px', cursor: 'pointer',
            letterSpacing: '0.12em', zIndex: 10,
          }}
        >
          {scale.toFixed(1)}× — Réinitialiser
        </button>
      )}

      {/* ── Image ── */}
      <div
        style={{ touchAction: 'none', userSelect: 'none', cursor: scale > 1 ? 'grab' : 'zoom-in' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt=""
          draggable={false}
          style={{
            maxWidth: '92vw',
            maxHeight: '88vh',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: scale === 1 ? 'transform 0.3s ease, opacity 0.22s ease' : 'none',
            opacity: visible ? 1 : 0,
            display: 'block',
            WebkitUserSelect: 'none',
          }}
        />
      </div>
    </div>
  )
}
