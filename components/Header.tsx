'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'
import { DOMAIN } from '@/lib/constants'

export default function Header() {
  const router = useRouter()
  const { cartCount, toggleCart } = useStore()

  function shareSite() {
    if (navigator.share) {
      navigator.share({
        title: 'LUX TIME - Montres de Luxe au Maroc',
        text: '⌚ Découvrez LUX TIME — Montres de luxe, livraison gratuite partout au Maroc !',
        url: DOMAIN,
      })
    } else {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`⌚ Découvrez LUX TIME — Montres de luxe au Maroc !\n${DOMAIN}`)}`,
        '_blank'
      )
    }
  }

  return (
    <header
      className="fixed top-0 left-0 w-full z-[1000] bg-white/[.98] backdrop-blur-md border-b border-gray-100 h-[60px] flex items-center shadow-sm px-5 md:px-12"
    >
      <div className="w-full grid grid-cols-3 items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-bold uppercase tracking-widest hidden md:flex items-center gap-2 hover:text-[#C5A059] transition text-gray-800"
          >
            <i className="fa-solid fa-house" /> Accueil
          </button>
        </div>

        <div className="flex justify-center">
          <h1
            onClick={() => router.push('/')}
            className="font-serif text-xl md:text-3xl font-black tracking-[0.2em] text-black uppercase cursor-pointer drop-shadow-sm whitespace-nowrap"
          >
            LUX TIME
          </h1>
        </div>

        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={shareSite}
            title="Partager le site"
            className="flex items-center gap-1 bg-[#F2EBE0] text-[#7A6145] text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-[#E0D4C0] hover:bg-[#E8DDD0] transition"
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-[10px]" />
          </button>
          <button
            onClick={toggleCart}
            className="flex items-center gap-1 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full hover:bg-black transition"
          >
            <i className="fa-solid fa-bag-shopping text-[10px]" />
            <span className="text-[10px] font-bold">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
