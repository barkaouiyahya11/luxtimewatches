
export const VITRINE_IMG = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777675221/luxtim/espf5fbjdccmvejteldv.jpg'

export default function VitrineSection() {
  return (
    <section className="w-full px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <div
        className="w-full overflow-hidden rounded-[12px] relative"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VITRINE_IMG}
          alt="Vitrine GUSHKIN"
          className="w-full object-cover"
          style={{ maxHeight: '480px', objectPosition: 'center center' }}
        />
      </div>
    </section>
  )
}
