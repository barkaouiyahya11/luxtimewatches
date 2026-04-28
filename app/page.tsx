import Hero from '@/components/Hero'
import AnnouncementBar from '@/components/AnnouncementBar'
import GoldBanner from '@/components/GoldBanner'
import TrustSection from '@/components/TrustSection'
import ReviewsSection from '@/components/ReviewsSection'
import Footer from '@/components/Footer'
import ProductGrid from '@/components/ProductGrid'
import { approvedReviews } from '@/data/reviews'
import { products } from '@/data/products'

export default function HomePage() {
  const femme = products.filter((p) => p.cat === 'femme')
  const homme = products.filter((p) => p.cat === 'homme')

  return (
    <>
      <Hero />
      <AnnouncementBar />
      <GoldBanner />

      {/* ── Collection Femme ── */}
      <section id="coll-femme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
            Collection Femme
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>
        <ProductGrid products={femme} />
      </section>

      {/* ── Collection Homme ── */}
      <section id="coll-homme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-gray-200 w-12 md:w-24" />
          <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
            Collection Homme
          </h2>
          <div className="h-px bg-gray-200 w-12 md:w-24" />
        </div>
        <ProductGrid products={homme} />
      </section>

      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
