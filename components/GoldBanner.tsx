'use client'

const BANNER_IMAGES = [
  {
    src: 'https://i.ibb.co/DfJh70n6/Gemini-Generated-Image-rdy4m6rdy4m6rdy4-1.png',
    alt: 'LUX TIME 18K Gold Collection 1',
  },
  {
    src: 'https://i.ibb.co/dwDPGFXf/Whats-App-Image-2026-03-23-at-18-02-06-1.jpg',
    alt: 'LUX TIME 18K Gold Luxe',
  },
  {
    src: 'https://i.ibb.co/W4ZCgmbC/Whats-App-Image-2026-03-27-at-20-25-56.jpg',
    alt: 'LUX TIME 18K Gold Collection 2',
  },
]

export default function GoldBanner() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      className="w-full py-10 md:py-20"
      style={{
        background: 'linear-gradient(160deg, #f0f0f0 0%, #e8e8e8 25%, #f5f5f5 55%, #ebebeb 80%, #f2f2f2 100%)',
      }}
    >
      <div className="gold-banner-wrap">
        <div className="gold-banner-grid">
          {BANNER_IMAGES.map((img) => (
            <div 
              key={img.src} 
              className="gold-banner-item mx-auto"
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                aspectRatio: '1/1',
                border: '3px solid #C5A059',
                width: '100%',
                maxWidth: '400px', // Prevents it from getting too large on wide screens if grid is loose
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.src} 
                alt={img.alt} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          ))}
        </div>

        <div className="gold-banner-text text-center px-4">
          <h2 className="gold-banner-title font-serif text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-black leading-none mb-2">
            DEFINE{' '}
            <span
              className="gold-banner-launch"
              style={{
                fontFamily: 'var(--font-allura), cursive',
                fontWeight: 400,
                textTransform: 'none',
                letterSpacing: 0,
                color: '#000',
                display: 'inline-block',
                transform: 'translateY(8px)',
                marginLeft: '6px',
                fontSize: '1.1em',
              }}
            >
              Your Style
            </span>
          </h2>
          <p className="gold-banner-sub text-[11px] md:text-xs uppercase tracking-[0.35em] text-black font-semibold mt-4">
            Collection Exclusive · À Partir de 149 MAD
          </p>
          <button
            onClick={() => scrollTo('coll-femme')}
            className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 mt-6 md:mt-8 hover:bg-[#C5A059] transition-colors duration-300"
          >
            EXPLORE NOW
          </button>
        </div>
      </div>
    </section>
  )
}
