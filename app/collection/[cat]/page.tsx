'use client'

import { useParams, useRouter } from 'next/navigation'
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

export default function CollectionPage() {
  useScrollReveal()
  const params = useParams()
  const router = useRouter()
  const cat = params.cat as string

  const filtered = (() => {
    if (cat === 'homme-simple') return products.filter((p) => p.cat === 'homme' && !p.coffret)
    if (cat === 'homme-coffret') return products.filter((p) => p.cat === 'homme' && p.coffret)
    if (cat === 'femme-simple') return products.filter((p) => p.cat === 'femme' && !p.coffret)
    if (cat === 'femme-coffret') return products.filter((p) => p.cat === 'femme' && p.coffret)
    return products.filter((p) => p.cat === cat)
  })()

  const title = TITLES[cat] ?? 'Collection'
  const subtitle = SUBTITLES[cat] ?? ''
  const showBack = ['homme-simple', 'homme-coffret', 'femme-simple', 'femme-coffret'].includes(cat)

  return (
    <>
      <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">

        {/* Back button for sub-collections */}
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
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Aucun produit trouvé.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
