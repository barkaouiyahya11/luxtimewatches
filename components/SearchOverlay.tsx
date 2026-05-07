'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { products } from '@/data/products'

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Live suggestions (max 5)
  const suggestions = query.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    inputRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function search() {
    if (!query.trim()) return
    onClose()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function goProduct(id: number) {
    onClose()
    router.push(`/product/${id}`)
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mt-28 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar */}
        <div
          className="flex items-center gap-3 bg-white px-5 py-4"
          style={{ border: '1.5px solid #111' }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Rechercher une montre..."
            className="flex-1 outline-none text-base text-black font-medium bg-transparent"
            style={{ fontFamily: 'var(--font-playfair), serif', letterSpacing: '0.04em' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-300 hover:text-black transition p-1">
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          )}
          <button
            onClick={search}
            className="text-gray-400 hover:text-black transition p-1"
          >
            <i className="fa-solid fa-magnifying-glass text-base" />
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <button onClick={onClose} className="text-gray-400 hover:text-black transition p-1">
            <i className="fa-solid fa-xmark text-base" />
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white" style={{ borderLeft: '1.5px solid #111', borderRight: '1.5px solid #111', borderBottom: '1.5px solid #111' }}>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 px-5 pt-4 pb-2">
              Produits
            </p>
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => goProduct(p.id)}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[#FAF9F7] transition-colors border-t border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.gridImg}
                  alt={p.name}
                  className="w-12 h-12 object-cover flex-shrink-0"
                  style={{ border: '0.8px solid #ddd' }}
                />
                <div className="text-left flex-1">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-black leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {p.price}.00 DH
                  </p>
                </div>
                <i className="fa-solid fa-arrow-right text-[10px] text-gray-300" />
              </button>
            ))}
            {/* See all results */}
            <button
              onClick={search}
              className="w-full text-center py-3 text-[11px] font-black uppercase tracking-widest text-[#C6A769] hover:bg-[#FAF9F7] transition border-t border-gray-100"
            >
              Voir tous les résultats →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
