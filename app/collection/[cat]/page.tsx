'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const TITLES: Record<string, string> = {
  femme: 'Collection Femme',
  homme: 'Collection Homme',
  'homme-simple': 'Collection Homme — Boite Simple',
  'homme-coffret': 'Collection Homme — Avec Coffret',
  'femme-simple': 'Collection Femme — Boite Simple',
  'femme-coffret': 'Collection Femme — Avec Coffret',
}

const SUBTITLES: Record<string, string> = {
  femme: 'Sublime ta beauté avec nos montres ✨',
  homme: 'Style & élégance pour homme ✨',
  'homme-simple': 'Montres homme avec boite simple',
  'homme-coffret': 'Montres homme avec coffret cadeau',
  'femme-simple': 'Montres femme avec boite simple',
  'femme-coffret': 'Montres femme avec coffret cadeau',
}

const PER_PAGE = 16

function getInitialPage(): number {
  if (typeof window === 'undefined') return 1
  const p = parseInt(new URLSearchParams(window.location.search).get('page') ?? '1', 10)
  return isNaN(p) || p < 1 ? 1 : p
}

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const cat = params.cat as string

  const [page, setPage] = useState<number>(getInitialPage)
  useScrollReveal([page])

  const filtered = (() => {
    if (cat === 'homme-simple') return products.filter((p) => p.cat === 'homme' && !p.coffret)
    if (cat === 'homme-coffret') return products.filter((p) => p.cat === 'homme' && p.coffret)
    if (cat === 'femme-simple') return products.filter((p) => p.cat === 'femme' && !p.coffret)
    if (cat === 'femme-coffret') return products.filter((p) => p.cat === 'femme' && p.coffret)
    return products.filter((p) => p.cat === cat)
  })()

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const title = TITLES[cat] ?? 'Collection'
  const subtitle = SUBTITLES[cat] ?? ''
  const showBack = ['homme-simple', 'homme-coffret', 'femme-simple', 'femme-coffret'].includes(cat)

  const goToPage = useCallback((p: number) => {
    setPage(p)
    // Met à jour l'URL sans navigation (pas de reload, pas de saut)
    const url = new URL(window.location.href)
    url.searchParams.set('page', String(p))
    window.history.replaceState({}, '', url.pathname + url.search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">

        {/* Back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Retour
          </button>
        )}

        {/* Title */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-[1px] bg-gray-200 w-12 md:w-24" />
            <h1
              style={{
                fontFamily: 'var(--font-allura), cursive',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 400,
                color: '#000',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <div className="h-[1px] bg-gray-200 w-12 md:w-24" />
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">{subtitle}</p>
          )}
          {totalPages > 1 && (
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              {filtered.length} articles — Page {page} / {totalPages}
            </p>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Aucun produit trouvé.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            {/* Prev */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-black hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-black transition ${
                  p === page
                    ? 'bg-black text-white'
                    : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-black hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
