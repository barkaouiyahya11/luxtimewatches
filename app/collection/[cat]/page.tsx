import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export default function CollectionPage({ params }: { params: { cat: string } }) {
  const cat = params.cat?.toLowerCase()
  
  if (cat !== 'femme' && cat !== 'homme') {
    notFound()
  }

  const collectionProducts = products.filter((p) => p.cat === cat)
  const title = cat === 'femme' ? 'Collection Femme' : 'Collection Homme'

  return (
    <div className="px-4 md:px-8 py-10 text-center max-w-7xl mx-auto min-h-[60vh]">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px bg-gray-200 w-12 md:w-24" />
        <h1 className="text-xl md:text-3xl font-serif uppercase tracking-[0.15em] font-black text-black">
          {title}
        </h1>
        <div className="h-px bg-gray-200 w-12 md:w-24" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {collectionProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
