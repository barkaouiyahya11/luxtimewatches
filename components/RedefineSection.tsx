'use client'

export default function RedefineSection() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="w-full bg-[#fdfbf8] py-16 md:py-24 text-center px-4">
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-black">
        REDEFINE{' '}
        <span 
          className="italic"
          style={{ 
            fontFamily: 'var(--font-allura), cursive', 
            textTransform: 'none', 
            color: '#C5A059', 
            fontSize: '1.2em',
            fontWeight: 400
          }}
        >
          Your Style
        </span>
      </h2>
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500 font-semibold mt-4">
        Collection Exclusive Montres · Maroc 🇲🇦
      </p>
      <button 
        onClick={() => scrollTo('coll-femme')}
        className="mt-8 bg-black text-white uppercase tracking-widest font-black text-[10px] px-10 py-4 hover:bg-[#C5A059] transition-colors duration-300 rounded-none"
      >
        EXPLORE NOW
      </button>
    </section>
  )
}
