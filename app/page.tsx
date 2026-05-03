import Hero from '@/components/Hero'
import AnnouncementBar from '@/components/AnnouncementBar'
import GoldBanner from '@/components/GoldBanner'
import TrustSection from '@/components/TrustSection'
import ReviewsSection from '@/components/ReviewsSection'
import Footer from '@/components/Footer'
import HommeSection from '@/components/HommeSection'
import FemmeSection from '@/components/FemmeSection'
import { approvedReviews } from '@/data/reviews'
import { products } from '@/data/products'

export default function HomePage() {
  const femme = products.filter((p) => p.cat === 'femme')
  const homme = products.filter((p) => p.cat === 'homme')

  return (
    <>
      <Hero />
      <AnnouncementBar />

      {/* ── Collection Homme ── */}
      <HommeSection products={homme} />

      <GoldBanner />

      {/* ── Collection Femme ── */}
      <FemmeSection products={femme} />

      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
