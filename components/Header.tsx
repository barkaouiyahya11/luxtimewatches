'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'
import { DOMAIN } from '@/lib/constants'
import SearchOverlay from '@/components/SearchOverlay'

export default function Header() {
  const router = useRouter()
  const { cartCount, toggleCart } = useStore()

  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible]   = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 20)
      setVisible(y < lastY.current || y < 60)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function shareSite() {
    if (navigator.share) {
      navigator.share({
        title: 'LUX TIME - Montres de Luxe au Maroc',
        text: '⌚ Découvrez LUX TIME — Montres de luxe, livraison gratuite partout au Maroc !',
        url: DOMAIN,
      })
    } else {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `⌚ Découvrez LUX TIME — Montres de luxe au Maroc !\n${DOMAIN}`
        )}`,
        '_blank'
      )
    }
  }

  return (
    <>
      <style>{`
        .nav-link { position: relative; display: inline-block; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%; right: 50%;
          height: 1px;
          background: #C5A059;
          transition: left 0.4s cubic-bezier(0.4,0,0.2,1),
                      right 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover::after { left: 0%; right: 0%; }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: scrolled ? 0 : 45, left: 0,
          width: '100%',
          /* ── Always higher than everything ── */
          zIndex: 9999,
          /* ── Smart reveal ── */
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          /* ── Height shrink ── */
          height: scrolled ? '52px' : '64px',
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.05)',
          transition:
            'transform 0.4s cubic-bezier(0.4,0,0.2,1),' +
            'height 0.4s cubic-bezier(0.4,0,0.2,1),' +
            'background 0.4s cubic-bezier(0.4,0,0.2,1),' +
            'box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div className="w-full grid grid-cols-3 items-center max-w-7xl mx-auto">

          {/* Left */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="nav-link text-[10px] font-bold uppercase tracking-widest hidden md:flex items-center gap-2 text-[#1a1a1a] hover:text-[#555] transition-colors duration-300"
            >
              <i className="fa-solid fa-house text-[10px]" /> Accueil
            </button>
          </div>

          {/* Center — Logo */}
          <div className="flex justify-center">
            <div
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', userSelect: 'none' }}
            >
              <h1
                style={{
                  fontSize: scrolled ? '1.1rem' : '1.45rem',
                  transition: 'font-size 0.4s cubic-bezier(0.4,0,0.2,1)',
                  letterSpacing: '0.35em',
                  fontWeight: 400,
                  fontFamily: 'var(--font-playfair), serif',
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                GUSHKIN
              </h1>
              {/* Line + subtitle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, transparent, #1a1a1a)' }} />
                <span style={{
                  fontSize: '6px',
                  letterSpacing: '0.4em',
                  fontFamily: 'sans-serif',
                  fontWeight: 400,
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  ACCESSOIRES
                </span>
                <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, #1a1a1a, transparent)' }} />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 justify-end">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center bg-[#1a1a1a] text-white px-2.5 py-1.5 rounded-full hover:bg-[#333] transition-colors duration-300"
              title="Rechercher"
            >
              <i className="fa-solid fa-magnifying-glass text-[10px]" />
            </button>
            <button
              onClick={shareSite}
              title="Partager"
              className="flex items-center bg-[#1a1a1a] text-white px-2.5 py-1.5 rounded-full hover:bg-[#333] transition-colors duration-300"
            >
              <i className="fa-solid fa-arrow-up-from-bracket text-[10px]" />
            </button>
            <button
              onClick={toggleCart}
              className="flex items-center gap-1.5 bg-[#1a1a1a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#333] transition-colors duration-300"
            >
              <i className="fa-solid fa-bag-shopping text-[10px]" />
              <span>{cartCount}</span>
            </button>
          </div>

        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
