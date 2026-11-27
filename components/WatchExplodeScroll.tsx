'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   ACCUEIL — MONTRE QUI SE DÉMONTE AU SCROLL
   - 97 images (public/art/demontage/) tirées d'une vidéo Higgsfield
     (montre acier, cadran bleu marine, fond plage claire).
   - Le scroll fait avancer l'animation : la montre s'ouvre, le verre monte,
     le cadran se soulève et le mouvement apparaît au milieu.
   - À la fin, le mot GUSHKIN s'écrit, puis la Collection Homme arrive.
───────────────────────────────────────────── */

const FRAME_COUNT = 97
const FRAME_W = 720
const FRAME_H = 1280
const GOLD = '#d9e2ec' // argent, assorti à la montre acier
const LETTERS = 'GUSHKIN'.split('')

/* Part du scroll consacrée au démontage (le reste sert au texte GUSHKIN) */
const EXPLODE_END = 0.7

const frameSrc = (i: number) => `/art/demontage/f_${String(i + 1).padStart(3, '0')}.webp`

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start))

export default function WatchExplodeScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const lineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* ── Préchargement des images ── */
    const frames: HTMLImageElement[] = []
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false)
    let current = -1
    let raf = 0

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d
        if (i + d < FRAME_COUNT && loaded[i + d]) return i + d
      }
      return -1
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      current = -1
      update()
    }

    /* Calque intermédiaire : l'image nette avec des bords fondus dans le décor */
    const off = document.createElement('canvas')
    const offCtx = off.getContext('2d')

    /* Plage vide pour remplir les côtés sur grand écran */
    const bg = new Image()
    let bgLoaded = false
    bg.onload = () => {
      bgLoaded = true
      current = -1
      onScroll()
    }
    bg.src = '/art/demontage/plage.jpg'

    const draw = (index: number, shade: number, scale: number) => {
      const i = nearestLoaded(index)
      if (i < 0 || !offCtx) return
      const img = frames[i]
      const W = canvas.width
      const H = canvas.height
      // La montre occupe toute la hauteur de l'écran
      const h = H * scale
      const w = h * (FRAME_W / FRAME_H)
      const x = (W - w) / 2
      const y = (H - h) / 2

      // Fond : plage vide et floue, en plein écran (cover)
      ctx.fillStyle = '#e6f1f4'
      ctx.fillRect(0, 0, W, H)
      if (bgLoaded) {
        const bs = Math.max(W / bg.naturalWidth, H / bg.naturalHeight)
        const bw = bg.naturalWidth * bs
        const bh = bg.naturalHeight * bs
        ctx.drawImage(bg, (W - bw) / 2, (H - bh) * 0.4, bw, bh)
      }

      if (w >= W) {
        // Écran étroit (téléphone) : l'image couvre tout
        ctx.drawImage(img, x, y, w, h)
      } else {
        // …et l'image nette est posée au centre avec des bords fondus
        off.width = Math.ceil(w)
        off.height = Math.ceil(h)
        offCtx.globalCompositeOperation = 'source-over'
        offCtx.drawImage(img, 0, 0, off.width, off.height)
        const g = offCtx.createLinearGradient(0, 0, off.width, 0)
        g.addColorStop(0, 'rgba(0,0,0,0)')
        g.addColorStop(0.18, 'rgba(0,0,0,1)')
        g.addColorStop(0.82, 'rgba(0,0,0,1)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        offCtx.globalCompositeOperation = 'destination-in'
        offCtx.fillStyle = g
        offCtx.fillRect(0, 0, off.width, off.height)
        ctx.drawImage(off, x, y, w, h)
      }

      // Fin : voile bleu marine pour faire ressortir GUSHKIN
      if (shade > 0) {
        ctx.fillStyle = `rgba(8,22,45,${shade})`
        ctx.fillRect(0, 0, W, H)
      }
    }

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const total = section.offsetHeight - vh
      const top = section.getBoundingClientRect().top
      const p = clamp(-top / total)

      // 1) Démontage
      const e = range(p, 0, EXPLODE_END)
      const index = Math.round(e * (FRAME_COUNT - 1))
      // 2) Fin : voile bleu marine derrière le texte
      const t = range(p, EXPLODE_END, 0.92)
      const shade = t * 0.72
      const scale = 1 - t * 0.06
      const key = index * 1000 + Math.round(shade * 100) + Math.round(scale * 1000) * 100000
      if (key !== current) {
        current = key
        draw(index, shade, scale)
      }

      if (introRef.current) {
        const o = 1 - range(p, 0, 0.1)
        introRef.current.style.opacity = String(o)
        introRef.current.style.transform = `translateY(${-range(p, 0, 0.1) * 40}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - range(p, 0, 0.04))

      // 3) GUSHKIN s'écrit lettre par lettre
      letterRefs.current.forEach((el, k) => {
        if (!el) return
        const s = EXPLODE_END + 0.02 + k * 0.022
        const lp = range(p, s, s + 0.06)
        el.style.opacity = String(lp)
        el.style.transform = `translateY(${(1 - lp) * 24}px)`
        el.style.filter = `blur(${(1 - lp) * 8}px)`
      })
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${range(p, 0.88, 0.95)})`
      if (subRef.current) subRef.current.style.opacity = String(range(p, 0.9, 0.97))
      if (brandRef.current) brandRef.current.style.visibility = p > EXPLODE_END ? 'visible' : 'hidden'
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        loaded[i] = true
        // Redessine si l'image utile vient d'arriver
        current = -1
        onScroll()
      }
      img.src = frameSrc(i)
      frames.push(img)
    }

    resize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
      frames.forEach((f) => (f.onload = null))
    }
  }, [])

  return (
    /* marginTop négatif : l'animation passe sous la barre d'annonce + l'en-tête (109px) */
    <section ref={sectionRef} className="wes" aria-label="Gushkin — l'intérieur d'une montre">
      <div className="wes-sticky">
        <canvas ref={canvasRef} className="wes-canvas" />
        {/* Image de secours (avant le chargement du canvas / sans JavaScript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frameSrc(0)} alt="Montre Gushkin" className="wes-canvas" style={{ objectFit: 'contain' }} />
        </noscript>

        <div ref={introRef} className="wes-intro">
          <p className="wes-tag">Gushkin · Maroc</p>
          <p className="font-serif wes-intro-title">Au cœur du temps</p>
        </div>

        <div ref={hintRef} className="wes-hint">
          <span>Scroll</span>
          <i />
        </div>

        <div ref={brandRef} className="wes-brand">
          <h1 className="font-serif wes-word" aria-label="GUSHKIN">
            {LETTERS.map((l, k) => (
              <span
                key={k}
                ref={(el) => {
                  letterRefs.current[k] = el
                }}
                aria-hidden="true"
              >
                {l}
              </span>
            ))}
          </h1>
          <div ref={lineRef} className="wes-line" />
          <p ref={subRef} className="wes-sub">
            Montres &amp; Accessoires de Luxe
          </p>
        </div>
      </div>

      <style>{`
        .wes { position: relative; height: 420vh; margin-top: -109px; background: #e6f1f4; }
        .wes-sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
        .wes-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .wes-intro {
          position: absolute; left: 0; right: 0; top: calc(109px + 3vh);
          text-align: center; color: #0c2340; pointer-events: none; will-change: opacity, transform;
        }
        .wes-tag { font-size: 11px; letter-spacing: .4em; text-transform: uppercase; color: #0c2340; opacity: .75; margin: 0 0 10px; }
        .wes-intro-title { font-size: clamp(1.6rem, 3.6vw, 2.8rem); font-weight: 400; margin: 0; text-shadow: 0 1px 18px rgba(255,255,255,.7); }
        .wes-hint {
          position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none;
        }
        .wes-hint span { font-size: 8px; letter-spacing: .3em; text-transform: uppercase; color: rgba(12,35,64,.75); }
        .wes-hint i { display: block; width: 1px; height: 40px; background: linear-gradient(to bottom, #0c2340, transparent); animation: scrollLine 1.8s ease-in-out infinite; }
        .wes-brand {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; pointer-events: none; visibility: hidden;
        }
        .wes-word {
          margin: 0; color: #fff; font-weight: 400; line-height: 1;
          font-size: clamp(3rem, 12vw, 9rem); letter-spacing: .12em; padding-left: .12em;
          text-shadow: 0 4px 40px rgba(0,0,0,.6);
        }
        .wes-word span { display: inline-block; opacity: 0; will-change: opacity, transform, filter; }
        .wes-line { width: 90px; height: 1px; background: ${GOLD}; margin: 28px 0 18px; transform: scaleX(0); }
        .wes-sub { margin: 0; font-size: 11px; letter-spacing: .4em; text-transform: uppercase; color: ${GOLD}; opacity: 0; }
        @media (max-width: 767px) {
          .wes { height: 380vh; }
          .wes-word { letter-spacing: .08em; padding-left: .08em; }
          .wes-sub { font-size: 9px; letter-spacing: .3em; }
        }
      `}</style>
    </section>
  )
}
