
export const SHOWCASE_IMG = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777842074/luxtim/tnwfyxum5urabiwc1skq.jpg'

export default function ShowcaseSection() {
  if (!SHOWCASE_IMG) return null

  return (
    <section className="w-full relative overflow-hidden bg-white" style={{ height: 'clamp(280px, 55vw, 540px)' }}>

      {/* Arch top — white curve covering the top edge */}
      <div className="absolute top-0 left-0 right-0 z-10" style={{ height: '70px' }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,70 C360,0 1080,0 1440,70 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SHOWCASE_IMG}
        alt="GUSHKIN"
        className="w-full h-full object-cover object-center"
      />

      {/* Subtle dark overlay — color effect only, no text */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Arch bottom — white curve */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: '70px' }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C360,70 1080,70 1440,0 L1440,70 L0,70 Z" fill="white" />
        </svg>
      </div>

    </section>
  )
}
