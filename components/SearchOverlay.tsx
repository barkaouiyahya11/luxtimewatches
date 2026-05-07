'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { products } from '@/data/products'

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    inputRef.current?.focus()
    // Close on Escape
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function go(id: number) {
    onClose()
    router.push(`/product/${id}`)
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mt-24 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 bg-white px-5 py-4"
          style={{ borderRadius: '0px', border: '1.5px solid #111' }}
        >
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une montre..."
            className="flex-1 outline-none text-sm text-black font-medium tracking-wide bg-transparent"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-black transition">
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white mt-1" style={{ border: '1px solid #eee' }}>
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => go(p.id)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#FAF9F7] transition-colors border-b border-gray-100 last:border-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.gridImg}
                  alt={p.name}
                  className="w-12 h-12 object-cover flex-shrink-0"
                  style={{ border: '0.8px solid #111' }}
                />
                <div className="text-left flex-1">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-black leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {p.price}.00 DH
                  </p>
                </div>
                <i className="fa-solid fa-arrow-right text-[10px] text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="bg-white mt-1 px-5 py-6 text-center" style={{ border: '1px solid #eee' }}>
            <p className="text-[12px] text-gray-400 uppercase tracking-widest">Aucun résultat trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
