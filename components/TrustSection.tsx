const TRUST_ITEMS = [
  {
    icon: 'fa-truck-fast',
    title: 'Livraison Gratuite',
    desc: 'Partout au Maroc sous 24/48h.',
  },
  {
    icon: 'fa-handshake-angle',
    title: 'Paiement Cash',
    desc: 'Payez à la livraison 100% sécurisé.',
  },
  {
    icon: 'fa-medal',
    title: 'Qualité Premium',
    desc: 'Savoir-faire et garantie produit.',
  },
]

export default function TrustSection() {
  return (
    <section className="bg-[#Fdfbf8] py-16 text-center border-t border-b border-[#efe7dd] mt-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="font-serif text-2xl md:text-3xl mb-12 uppercase tracking-[0.1em] font-black italic text-gray-800">
          L&apos;Excellence Lux Time
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 transition group-hover:scale-110 group-hover:shadow-lg">
                <i className={`fa-solid ${item.icon} text-2xl text-[#C5A059]`} />
              </div>
              <h4 className="font-black text-xs uppercase mb-2 tracking-widest text-black">
                {item.title}
              </h4>
              <p className="text-[10px] text-gray-500 uppercase font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
