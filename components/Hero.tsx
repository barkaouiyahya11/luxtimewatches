'use client'

export default function Hero() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-col mb-[30px]">
      <div className="flex flex-col md:flex-row gap-3 px-4 w-full max-w-3xl mx-auto py-4 z-10">
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

      <section
        className="hero-container relative w-full h-[55vh] md:h-[70vh]"
        style={{
          minHeight: '350px',
          maxHeight: '700px',
          background:
            "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('https://i.ibb.co/wvW0v0m/Gemini-Generated-Image-swd0bkswd0bkswd0.png') no-repeat center center / cover",
        }}
      />
    </div>
  )
}
