import Hero from '@/components/Hero'
import GoldBanner from '@/components/GoldBanner'
import ProductGrid from '@/components/ProductGrid'
import TrustSection from '@/components/TrustSection'
import ReviewsSection from '@/components/ReviewsSection'
import Footer from '@/components/Footer'
import { products } from '@/data/products'
import { approvedReviews } from '@/data/reviews'

export default function HomePage() {
  return (
    <>
      <Hero />
      <GoldBanner />
      <ProductGrid products={products} />
      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
