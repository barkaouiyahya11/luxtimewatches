import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import ProductDetail from '@/components/ProductDetail'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }))
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))
  if (!product) notFound()

  return (
    <>
      <ProductDetail product={product} />
      <Footer />
    </>
  )
}
