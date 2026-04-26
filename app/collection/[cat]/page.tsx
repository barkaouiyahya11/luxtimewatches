import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'

interface Props { params: Promise<{ cat: string }> }

export function generateStaticParams() {
return [{ cat: 'femme' }, { cat: 'homme' }]
}

export default async function CollectionPage({ params }: Props) {
const { cat } = await params
if (cat !== 'femme' && cat !== 'homme') notFound()
const filtered = products.filter(p => p.cat === cat)
return (
<>
<div className='px-4 md:px-8 py-10 max-w-7xl mx-auto'>
<h1 className='text-2xl font-serif font-black uppercase tracking-[0.15em] text-center mb-10'>
{cat === 'femme' ? 'COLLECTION FEMME' : 'COLLECTION HOMME'}
</h1>
<div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
{filtered.map(p => <ProductCard key={p.id} product={p} />)}
</div>
</div>
<Footer />
</>
)
}
