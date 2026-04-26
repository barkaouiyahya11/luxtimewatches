import Link from 'next/link'
import Hero from '@/components/Hero'
import AnnouncementBar from '@/components/AnnouncementBar'
import GoldBanner from '@/components/GoldBanner'
import TrustSection from '@/components/TrustSection'
import ReviewsSection from '@/components/ReviewsSection'
import Footer from '@/components/Footer'
import { approvedReviews } from '@/data/reviews'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar />
      <GoldBanner />
      
      <div className="px-4 md:px-8 py-10 text-center max-w-7xl mx-auto">
        <section className="mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px bg-gray-200 w-12 md:w-24" />
            <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
              Collection Femme
            </h2>
            <div className="h-px bg-gray-200 w-12 md:w-24" />
          </div>

          <div className="flex gap-2">
            <Link href="/collection/femme" className="w-1/2 group block">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src="https://i.ibb.co/TqdL78K6/Whats-App-Image-2026-03-23-at-17-58-22.jpg"
                  alt="Boîte Simple"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white pt-3 text-left">
                <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">BOÎTE SIMPLE →</p>
              </div>
            </Link>
            <div className="w-1/2 cursor-default group opacity-50">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src="https://i.ibb.co/TqdL78K6/Whats-App-Image-2026-03-23-at-17-58-22.jpg"
                  alt="Avec Packaging"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white pt-3 text-left">
                <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">AVEC PACKAGING →</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px bg-gray-200 w-12 md:w-24" />
            <h2 className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] font-black text-black">
              Collection Homme
            </h2>
            <div className="h-px bg-gray-200 w-12 md:w-24" />
          </div>

          <div className="flex gap-2">
            <Link href="/collection/homme" className="w-1/2 group block">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src="https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg"
                  alt="Boîte Simple"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white pt-3 text-left">
                <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">BOÎTE SIMPLE →</p>
              </div>
            </Link>
            <div className="w-1/2 cursor-default group opacity-50">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src="https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg"
                  alt="Avec Packaging"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white pt-3 text-left">
                <p className="font-serif font-bold uppercase text-black text-[13px] md:text-xl">AVEC PACKAGING →</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <TrustSection />
      <ReviewsSection reviews={approvedReviews} />
      <Footer />
    </>
  )
}
