'use client'
import { useParams } from 'next/navigation'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'

export default function CollectionPage() {
const params = useParams()
const cat = params.cat as string
const filtered = products.filter(p => p.cat === cat)
return (
<>
<div className='px-4 md:px-8 py-10 max-w-7xl mx-auto'>
<div className='flex items-center justify-center gap-4 mb-10'>
<div className='h-[1px] bg-gray-200 w-24'></div>
<h1 className='text-2xl font-serif font-black uppercase tracking-[0.15em] text-center'>{cat === 'femme' ? 'COLLECTION FEMME' : 'COLLECTION HOMME'}</h1>
<div className='h-[1px] bg-gray-200 w-24'></div>
</div>
<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8'>
{filtered.map(p => <ProductCard key={p.id} product={p} />)}
</div>
</div>
<Footer />
</>
)
}
