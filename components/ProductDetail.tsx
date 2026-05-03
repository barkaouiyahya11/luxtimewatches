'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useStore } from '@/context/StoreContext'
import { TIKTOK_URL } from '@/lib/constants'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const router = useRouter()
  const { addToCart, openCheckout, showToast, toggleCart } = useStore()
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState<number>(0)
  const [mainImg, setMainImg] = useState(
    product.colors?.length ? product.colors[0].img : product.gridImg
  )
  const [zoomed, setZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const [showSticky, setShowSticky] = useState(false)
  const orderBtnRef = useRef<HTMLButtonElement>(null)

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  const allImgs = [product.gridImg, ...product.detailImgs]

  // Show sticky bar when primary CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (orderBtnRef.current) observer.observe(orderBtnRef.current)
    return () => observer.disconnect()
  }, [])

  function handleZoom(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setZoomOrigin(`${x}% ${y}%`)
      setZoomed(true)
    } else {
      setZoomed(false)
    }
  }

  function handleAddToCart() {
    addToCart(product, qty)
    showToast('Ajouté au panier !')
    toggleCart()
  }

  function shareProduct() {
    const url = `https://www.luxtimewatches.store/product/${product.id}`
    if (navigator.share) {
      navigator.share({ title: `LUX TIME - ${product.name}`, text: `⌚ ${product.name} — ${product.price} MAD`, url })
    } else {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`⌚ ${product.name} — ${product.price} MAD\n${url}`)}`,
        '_blank'
      )
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl animate-fade-in pb-28 md:pb-16">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-black transition px-4 py-2 hover:bg-gray-50 rounded"
          >
            <i className="fa-solid fa-arrow-left" /> Retour
          </button>
          <button
            onClick={shareProduct}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 bg-gray-50 px-5 py-2.5 rounded-full shadow-sm hover:bg-black hover:text-white transition"
          >
            <i className="fa-solid fa-share-nodes" /> Partager
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 bg-white rounded-xl text-left">
          {/* Images */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div
              className="relative aspect-square overflow-hidden"
              style={{
                cursor: zoomed ? 'zoom-out' : 'zoom-in',
                ...(product.frame ? {
                  border: '4px solid #C5A059',
                  boxShadow: 'inset 0 0 0 3px #fff, inset 0 0 0 4px #C5A059, 0 8px 32px rgba(197,160,89,0.3)',
                  borderRadius: '10px',
                  padding: '6px',
                  background: '#fff',
                } : {
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }),
              }}
              onClick={handleZoom}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImg}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{
                  transform: zoomed ? 'scale(2.5)' : `scale(${product.imgScale || 1})`,
                  transformOrigin: zoomed ? zoomOrigin : (product.imgPosition || 'center'),
                  objectPosition: product.imgPosition || 'center',
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {allImgs.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => { setMainImg(img); setZoomed(false) }}
                  className={`w-20 h-20 object-cover rounded-lg shadow-sm border-2 cursor-pointer hover:border-gray-300 transition flex-shrink-0 ${
                    mainImg === img ? 'border-[#C5A059]' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pt-2 pb-2">
            <div className="inline-block bg-gray-100 text-gray-600 text-[9px] font-black uppercase px-3 py-1 rounded mb-2 w-fit tracking-widest">
              Premium Edition
            </div>
            <h1 className="text-xl md:text-4xl font-serif font-black uppercase mb-2 text-black leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#f59e0b] text-sm">★★★★★</span>
              <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviews} avis)</span>
            </div>

            <div className="flex items-end gap-3 mb-3">
              <p className="text-3xl md:text-5xl font-black text-black">
                {product.price}.00 <span className="text-lg text-gray-500">MAD</span>
              </p>
              <div className="flex flex-col gap-1 mb-1">
                <span className="line-through text-gray-400 text-sm font-semibold">
                  {product.originalPrice}.00 MAD
                </span>
                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded w-fit">
                  -{discount}%
                </span>
              </div>
            </div>

            {/* Color variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">COULEUR</p>
                <div className="flex flex-col gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(i)
                        setMainImg(c.img)
                        setZoomed(false)
                      }}
                      className={`w-full text-left px-5 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border-2 transition-all duration-200 ${
                        selectedColor === i
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging */}
            <div className="mb-4">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">CHOISIR VOTRE EMBALLAGE</p>
              <div className="flex gap-3">
                <div className="flex-1 border-2 border-[#C5A059] rounded-lg p-3 cursor-pointer text-center">
                  <p className="text-[9px] font-black uppercase">BOÎTE SIMPLE</p>
                  <p className="text-[9px] text-gray-400">+0 MAD</p>
                </div>
                <div className="flex-1 border border-gray-200 rounded-lg p-3 text-center opacity-40 cursor-not-allowed">
                  <p className="text-[9px] font-black uppercase">AVEC PACKAGING</p>
                  <p className="text-[9px] text-gray-300 italic">Bientôt disponible</p>
                </div>
              </div>
            </div>
            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quantité</p>
              <div className="flex items-center border-2 border-gray-100 w-28 h-11 rounded-lg bg-white overflow-hidden shadow-inner">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-full font-black text-xl hover:bg-gray-50 transition text-gray-500"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-base border-x border-gray-100 leading-[44px]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-full font-black text-xl hover:bg-gray-50 transition text-gray-500"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                ref={orderBtnRef}
                onClick={() => openCheckout('direct', product, qty)}
                className="btn-shine w-full py-4 font-black uppercase text-[11px] rounded-lg flex flex-col items-center justify-center gap-1 shadow-lg text-white"
                style={{ background: 'linear-gradient(135deg, #C5A059 0%, #d4b572 100%)' }}
              >
                <span>COMMANDER MAINTENANT</span>
                <span className="font-arabic text-[13px] text-white/90 font-bold">أطلب الآن</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 font-black uppercase text-[10px] rounded-lg hover:border-black hover:bg-black hover:text-white transition flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-cart-plus" /> Ajouter au panier
              </button>

              <button
                onClick={() => window.open(TIKTOK_URL, '_blank')}
                className="w-full py-3 flex items-center justify-center gap-3 font-black text-[10px] uppercase rounded-lg bg-gray-50 border border-gray-200 hover:bg-black hover:text-white transition"
              >
                <i className="fa-brands fa-tiktok text-lg" /> Voir la vidéo du produit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky order bar — mobile only, appears when CTA scrolls out of view */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 w-full z-[1500] px-4 pb-5 pt-3 bg-white border-t border-gray-100 shadow-xl md:hidden">
          <button
            onClick={() => openCheckout('direct', product, qty)}
            className="btn-shine w-full py-4 font-black uppercase text-[11px] rounded-lg flex flex-col items-center gap-1 shadow-lg text-white"
            style={{ background: 'linear-gradient(135deg, #C5A059 0%, #d4b572 100%)' }}
          >
            <span>COMMANDER MAINTENANT</span>
            <span className="font-arabic text-[13px] text-white/90 font-bold">أطلب الآن</span>
          </button>
        </div>
      )}
    </>
  )
}
