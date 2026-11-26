import HeroVideoScroll from '@/components/HeroVideoScroll'
import AnnouncementBar from '@/components/AnnouncementBar'
import GoldBanner from '@/components/GoldBanner'
import TrustSection from '@/components/TrustSection'
import ReviewsSection from '@/components/ReviewsSection'
import Footer from '@/components/Footer'
import HommeSection from '@/components/HommeSection'
import FemmeSection from '@/components/FemmeSection'
import ArtDuTempsSection from '@/components/ArtDuTempsSection'


import { approvedReviews } from '@/data/reviews'
import { products } from '@/data/products'

export default function HomePage() {
  const femme = products.filter((p) => p.cat === 'femme')
  const homme = products.filter((p) => p.cat === 'homme')
  return (
    <>
      <HeroVideoScroll />

      {/* ── Collection Homme ── */}
      <HommeSection products={homme} />

      {/* ── Collection Femme ── */}
      <FemmeSection products={femme} />

      {/* ── L'Art du Temps (visuels Higgsfield) ── */}
      <ArtDuTempsSection />

      <GoldBanner />

      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
