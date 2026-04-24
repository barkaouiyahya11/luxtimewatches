'use client'

export default function Hero() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      className="hero-container relative flex items-end justify-center"
      style={{
        height: '35vh',
        minHeight: '250px',
        maxHeight: '600px',
        background:
          "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('https://i.ibb.co/DfJh70n6/Gemini-Generated-Image-rdy4m6rdy4m6rdy4-1.png') no-repeat center 30% / cover",
        marginBottom: '30px',
      }}
    >
      <div className="flex flex-col md:flex-row gap-3 px-4 w-full max-w-3xl pb-8 z-10">
        <button
          onClick={() => scrollTo('coll-femme')}
          className="flex-1 bg-white/95 backdrop-blur text-black py-4 font-black uppercase text-[10px] tracking-widest rounded shadow-2xl hover:bg-white transition"
        >
          Collection Femme
        </button>
        <button
          onClick={() => scrollTo('coll-homme')}
          className="flex-1 bg-black/95 backdrop-blur text-white py-4 font-black uppercase text-[10px] tracking-widest rounded shadow-2xl hover:bg-black transition"
        >
          Collection Homme
        </button>
      </div>
    </section>
  )
}
