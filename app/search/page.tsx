'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''

  const results = q.trim().length >= 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
    : []

  return (
    <>
      <div className="min-h-screen px-4 md:px-8 py-10 max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          Retour
        </button>

        {/* Title */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: '#C6A769', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
            Résultats de recherche
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700, color: '#111111', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.15 }}>
            &ldquo;{q}&rdquo;
          </h1>
          <div style={{ width: '40px', height: '1px', background: '#C6A769', margin: '14px auto 0' }} />
          <p style={{ fontSize: '12px', color: '#6E6E6E', marginTop: '10px', letterSpacing: '0.05em' }}>
            {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm uppercase tracking-widest">Aucun produit trouvé pour &ldquo;{q}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
