'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useStore } from '@/context/StoreContext'
import { products } from '@/data/products'

interface Props {
  product: Product
}



export default function ProductDetail({ product }: Props) {
  const router = useRouter()
  const { addToCart, openCheckout, showToast, toggleCart } = useStore()
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState<number>(0)
  const [selectedBoxColor, setSelectedBoxColor] = useState<string>(
    product.boxColors?.[0] ?? ''
  )
  const [mainImg, setMainImg] = useState(
    product.colors?.length ? product.colors[0].img : product.gridImg
  )
  const [showSticky, setShowSticky] = useState(false)
  const orderBtnRef = useRef<HTMLButtonElement>(null)

  // ── Inline pinch-to-zoom ──
  const [imgZoom, setImgZoom] = useState(1)
  const [imgTranslate, setImgTranslate] = useState({ x: 0, y: 0 })
  const zLastDist = useRef<number | null>(null)
  const zLastPos = useRef<{ x: number; y: number } | null>(null)
  const zBaseScale = useRef(1)
  const zBaseTranslate = useRef({ x: 0, y: 0 })

  // Reset zoom when thumbnail changes
  useEffect(() => {
    setImgZoom(1)
    setImgTranslate({ x: 0, y: 0 })
  }, [mainImg])

  function resetImgZoom() {
    setImgZoom(1)
    setImgTranslate({ x: 0, y: 0 })
  }

  function onImgTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      zLastDist.current = Math.hypot(dx, dy)
      zBaseScale.current = imgZoom
      zBaseTranslate.current = { x: imgTranslate.x, y: imgTranslate.y }
    } else if (e.touches.length === 1 && imgZoom > 1) {
      zLastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      zBaseTranslate.current = { x: imgTranslate.x, y: imgTranslate.y }
    }
  }

  function onImgTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2) e.preventDefault()
    if (e.touches.length === 2 && zLastDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.min(Math.max(zBaseScale.current * (dist / zLastDist.current), 1), 5)
      setImgZoom(next)
      zBaseScale.current = next
      zLastDist.current = dist
    } else if (e.touches.length === 1 && imgZoom > 1 && zLastPos.current) {
      e.preventDefault()
      const dx = e.touches[0].clientX - zLastPos.current.x
      const dy = e.touches[0].clientY - zLastPos.current.y
      setImgTranslate({
        x: zBaseTranslate.current.x + dx,
        y: zBaseTranslate.current.y + dy,
      })
      zBaseTranslate.current = {
        x: zBaseTranslate.current.x + dx,
        y: zBaseTranslate.current.y + dy,
      }
      zLastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  function onImgTouchEnd() {
    zLastDist.current = null
    zLastPos.current = null
    if (imgZoom < 1.1) resetImgZoom()
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  // Deduplicate images
  const allImgs = [...new Set([product.gridImg, ...product.detailImgs])]

  // Related products (same cat, different id, max 4)
  const related = products
    .filter((p) => p.cat === product.cat && p.id !== product.id)
    .slice(0, 4)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (orderBtnRef.current) observer.observe(orderBtnRef.current)
    return () => observer.disconnect()
  }, [])


  function handleAddToCart() {
    const colorName = product.colors?.[selectedColor]?.name
    const extra = selectedBoxColor ? (colorName ? `${colorName} — ${selectedBoxColor}` : selectedBoxColor) : colorName
    addToCart(product, qty, extra)
    showToast('Ajouté au panier !')
    toggleCart()
  }

  function shareProduct() {
    const url = `https://www.gushkin.com/product/${product.id}`
    if (navigator.share) {
      navigator.share({ title: `GUSHKIN — ${product.name}`, text: `${product.name} — ${product.price} MAD`, url })
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${product.name} — ${product.price} MAD\n${url}`)}`, '_blank')
    }
  }

  return (
    <>
      <div style={{ background: '#F9F7F2', minHeight: '100vh' }}>
        <div className="container mx-auto px-4 md:px-8 max-w-6xl animate-fade-in pb-32 md:pb-16" style={{ paddingTop: '32px' }}>

          {/* ── Navigation ── */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => router.back()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6E6E6E' }}
              className="hover:text-black transition"
            >
              <i className="fa-solid fa-arrow-left text-[9px]" /> Retour
            </button>
            <button
              onClick={shareProduct}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6E6E6E', border: '1px solid #E8E4DE', padding: '8px 16px', borderRadius: '20px' }}
              className="hover:border-black hover:text-black transition"
            >
              <i className="fa-solid fa-share-nodes text-[9px]" /> Partager
            </button>
          </div>

          {/* ── Main Layout ── */}
          <div className="flex flex-col md:flex-row gap-10 lg:gap-20">

            {/* ── LEFT: Gallery ── */}
            <div className="w-full md:w-[52%] flex flex-col gap-4">

              {/* Main image — inline pinch-to-zoom */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  background: '#F9F8F6',
                  cursor: imgZoom > 1 ? 'grab' : 'default',
                  touchAction: 'pan-y',
                  userSelect: 'none',
                  ...(product.frame ? {
                    border: '2px solid #C6A769',
                    boxShadow: '0 4px 24px rgba(198,167,105,0.12)',
                  } : {
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  }),
                }}
                onTouchStart={onImgTouchStart}
                onTouchMove={onImgTouchMove}
                onTouchEnd={onImgTouchEnd}
              >
                {/* zoom wrapper */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${imgZoom}) translate(${imgTranslate.x / imgZoom}px, ${imgTranslate.y / imgZoom}px)`,
                    transition: imgZoom === 1 ? 'transform 0.3s ease' : 'none',
                    transformOrigin: 'center center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                    style={{
                      transform: `scale(${product.imgScale || 1})`,
                      transformOrigin: product.imgPosition || 'center',
                      objectPosition: product.imgPosition || 'center',
                      WebkitUserSelect: 'none',
                      display: 'block',
                    }}
                  />
                </div>

                {/* 🔍 — tap resets zoom */}
                <div
                  onClick={resetImgZoom}
                  style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.45)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '16px', cursor: 'pointer' }}
                >
                  🔍
                </div>
              </div>

              {/* Thumbnails */}
              {allImgs.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {allImgs.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img}
                      alt=""
                      onClick={() => { setMainImg(img) }}
                      style={{
                        width: '72px',
                        height: '90px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: mainImg === img ? '2px solid #111' : '1px solid rgba(0,0,0,0.05)',
                        transition: 'border-color 0.2s ease',
                        background: '#f9f8f6',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="w-full md:w-[48%] flex flex-col" style={{ paddingTop: '4px' }}>

              {/* Badge */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#C6A769',
                  border: '1px solid #C6A769',
                  padding: '4px 12px',
                  borderRadius: '2px',
                }}>
                  {product.hot ? 'Best Seller' : 'Édition Limitée'}
                </span>
              </div>

              {/* Product name */}
              <h1 style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                fontWeight: 700,
                color: '#111111',
                lineHeight: 1.2,
                letterSpacing: '0.03em',
                marginBottom: '20px',
              }}>
                {product.name}
              </h1>

              {/* Divider */}
              <div style={{ height: '1px', background: '#E8E4DE', marginBottom: '20px' }} />

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                  {product.price} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#6E6E6E' }}>MAD</span>
                </span>
                {discount > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#aaa', textDecoration: 'line-through', fontWeight: 500 }}>
                      {product.originalPrice} MAD
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: '#111', padding: '2px 8px', borderRadius: '2px', letterSpacing: '0.1em' }}>
                      -{discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Color variants */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6E6E6E', marginBottom: '10px' }}>
                    Couleur — <span style={{ color: '#111' }}>{product.colors[selectedColor]?.name}</span>
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedColor(i); setMainImg(c.img) }}
                        style={{
                          padding: '10px 20px',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          border: selectedColor === i ? '1.5px solid #111' : '1.5px solid #E8E4DE',
                          background: selectedColor === i ? '#111' : 'transparent',
                          color: selectedColor === i ? '#fff' : '#111',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Box color selector */}
              {product.boxColors && product.boxColors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6E6E6E', marginBottom: '10px' }}>
                    Couleur de la boîte — <span style={{ color: '#111' }}>{selectedBoxColor}</span>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.boxColors.map((bc) => {
                      const isGreen = bc.toLowerCase().includes('vert')
                      const isRed = bc.toLowerCase().includes('rouge')
                      const dotColor = isGreen ? '#2E7D32' : isRed ? '#C62828' : '#111'
                      return (
                        <button
                          key={bc}
                          onClick={() => setSelectedBoxColor(bc)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            border: selectedBoxColor === bc ? '1.5px solid #111' : '1.5px solid #E8E4DE',
                            background: selectedBoxColor === bc ? '#111' : 'transparent',
                            color: selectedBoxColor === bc ? '#fff' : '#111',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: selectedBoxColor === bc ? '#fff' : dotColor,
                            flexShrink: 0,
                            display: 'inline-block',
                          }} />
                          {bc}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6E6E6E', whiteSpace: 'nowrap' }}>
                  Quantité
                </p>
                <div style={{ display: 'flex', border: '1px solid #E8E4DE', borderRadius: '2px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ width: '40px', height: '40px', fontSize: '18px', fontWeight: 300, background: 'transparent', border: 'none', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    −
                  </button>
                  <span style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, borderLeft: '1px solid #E8E4DE', borderRight: '1px solid #E8E4DE' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    style={{ width: '40px', height: '40px', fontSize: '18px', fontWeight: 300, background: 'transparent', border: 'none', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                <button
                  ref={orderBtnRef}
                  onClick={() => {
                    const colorName = product.colors?.[selectedColor]?.name
                    const extra = selectedBoxColor ? (colorName ? `${colorName} — ${selectedBoxColor}` : selectedBoxColor) : colorName
                    openCheckout('direct', product, qty, extra)
                  }}
                  className="btn-ql"
                  style={{ width: '100%', padding: '16px', borderRadius: '2px' }}
                >
                  Commander — Paiement à la livraison
                </button>

                <button
                  onClick={handleAddToCart}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'transparent',
                    color: '#333333',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    border: '1.5px solid #000000',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0A0A0A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A1A1A'; e.currentTarget.style.borderColor = '#0A0A0A' }}
                >
                  <i className="fa-solid fa-bag-shopping text-[10px]" /> Ajouter au panier
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '20px 0', borderTop: '1px solid #E8E4DE', borderBottom: '1px solid #E8E4DE', marginBottom: '24px' }}>
                {[
                  { icon: 'fa-truck-fast', label: 'Livraison rapide' },
                  { icon: 'fa-hand-holding-dollar', label: 'Paiement livraison' },
                  { icon: 'fa-medal', label: 'Qualité premium' },
                ].map((item) => (
                  <div key={item.icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
                    <i className={`fa-solid ${item.icon}`} style={{ color: '#C6A769', fontSize: '16px' }} />
                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6E6E6E', lineHeight: 1.3 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Product details */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111', marginBottom: '14px' }}>
                  Détails du produit
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Référence', value: product.sku },
                    { label: 'Collection', value: product.cat === 'femme' ? 'Collection Femme' : 'Collection Homme' },
                    { label: 'Emballage', value: product.coffret ? 'Avec Coffret Premium' : 'Boîte Simple Élégante' },
                    { label: 'Livraison', value: 'Gratuite partout au Maroc' },
                    { label: 'Paiement', value: 'À la livraison uniquement' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EDE8' }}>
                      <span style={{ fontSize: '11px', color: '#6E6E6E', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: '11px', color: '#111', fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Vous aimerez aussi ── */}
          {related.length > 0 && (
            <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #E8E4DE' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#C6A769', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
                  Sélection pour vous
                </p>
                <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: '#111', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Vous aimerez aussi
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '24px' }}>
                {related.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/product/${p.id}`)}
                    style={{ cursor: 'pointer' }}
                    className="group"
                  >
                    <div className="relative" style={{ aspectRatio: '4/5', overflow: 'hidden', borderRadius: '12px', background: '#F9F8F6', marginBottom: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.gridImg}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                    </div>
                    <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px', lineHeight: 1.3 }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6E6E6E', fontWeight: 500 }}>
                      {p.price} MAD
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Sticky bar mobile ── */}
      {showSticky && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 1500, padding: '12px 16px 20px', background: '#fff', borderTop: '1px solid #E8E4DE', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }} className="md:hidden">
          <button
            onClick={() => {
              const colorName = product.colors?.[selectedColor]?.name
              const extra = selectedBoxColor ? (colorName ? `${colorName} — ${selectedBoxColor}` : selectedBoxColor) : colorName
              openCheckout('direct', product, qty, extra)
            }}
            className="btn-ql"
            style={{ width: '100%', padding: '15px', borderRadius: '2px' }}
          >
            Commander — Paiement à la livraison
          </button>
        </div>
      )}
    </>
  )
}
