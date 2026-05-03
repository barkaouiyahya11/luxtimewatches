
export const SHOWCASE_IMG = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777842074/luxtim/tnwfyxum5urabiwc1skq.jpg'

export default function ShowcaseSection() {
  if (!SHOWCASE_IMG) return null

  return (
    <section className="w-full relative overflow-hidden" style={{ height: 'clamp(320px, 60vw, 600px)' }}>
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SHOWCASE_IMG}
        alt="LUX TIME"
        className="w-full h-full object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            lineHeight: 1.1,
          }}
        >
          Une Touche<br />d&apos;Élégance
        </h2>
        <div
          className="mt-4 w-16 h-px"
          style={{ background: '#C5A059' }}
        />
      </div>

      {/* Curved bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '60px' }}
      >
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
