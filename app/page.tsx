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

      {/* ── Collection Femme ── */}
      <section id="coll-femme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-px bg-gray-200 w-12 md:w-24" />
            <h2
                style={{
                  fontFamily: 'var(--font-allura), cursive',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  color: '#000',
                  lineHeight: 1.2,
                }}
              >
                Nos Best Products
              </h2>
            <div className="h-px bg-gray-200 w-12 md:w-24" />
          </div>
          <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
            Sublime ta beauté avec nos montres ✨
          </p>
        </div>
        <ProductGrid products={femme} singleRow />
      </section>

      <GoldBanner />

      {/* ── Collection Homme ── */}
      <section id="coll-homme" className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-px bg-gray-200 w-12 md:w-24" />
            <h2
                style={{
                  fontFamily: 'var(--font-allura), cursive',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  color: '#000',
                  lineHeight: 1.2,
                }}
              >
                Nos Best Products
              </h2>
            <div className="h-px bg-gray-200 w-12 md:w-24" />
          </div>
          <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
            Style & élégance pour homme ✨
          </p>
        </div>
        <ProductGrid products={homme} scrollRow />
      </section>

      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
