'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'
import { DOMAIN } from '@/lib/constants'

export default function Header() {
  const router = useRouter()
  const { cartCount, toggleCart } = useStore()

  const [scrolled, setScrolled]   = useState(false) // glassmorphism active?
  const [visible, setVisible]     = useState(true)  // hide/show on scroll dir
  const lastY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 40)
      setVisible(y < lastY.current || y < 60)  // show when scrolling UP or near top
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
      {/* ── Luxury hover underline animation ── */}
      <style>{`
        .nav-link {
          position: relative;
          display: inline-block;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          right: 50%;
          height: 1px;
          background: #C5A059;
          transition: left 0.4s cubic-bezier(0.4,0,0.2,1),
                      right 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover::after {
          left: 0%;
          right: 0%;
        }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          /* ── Smart reveal: hide when scrolling down ── */
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          /* ── Shrink height on scroll ── */
          height: scrolled ? '52px' : '66px',
          /* ── Glassmorphism on scroll ── */
          background: scrolled
            ? 'rgba(255, 255, 255, 0.82)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: scrolled
            ? '1px solid rgba(197,160,89,0.15)'
            : '1px solid rgba(0,0,0,0.06)',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.08)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          /* ── Smooth transitions ── */
          transition:
            'transform 0.4s cubic-bezier(0.4,0,0.2,1), ' +
            'height 0.4s cubic-bezier(0.4,0,0.2,1), ' +
            'background 0.4s cubic-bezier(0.4,0,0.2,1), ' +
            'box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <div className="w-full grid grid-cols-3 items-center max-w-7xl mx-auto">

          {/* Left — Nav link */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="nav-link text-[10px] font-bold uppercase tracking-widest hidden md:flex items-center gap-2 text-gray-700 hover:text-[#C5A059] transition-colors duration-300"
            >
              <i className="fa-solid fa-house text-[10px]" />
              Accueil
            </button>
          </div>

          {/* Center — Logo with shrink */}
          <div className="flex justify-center">
            <h1
              onClick={() => router.push('/')}
              style={{
                fontSize: scrolled ? '1.25rem' : '1.6rem',
                transition: 'font-size 0.4s cubic-bezier(0.4,0,0.2,1)',
                letterSpacing: '0.22em',
                fontWeight: 900,
                fontFamily: 'var(--font-playfair), serif',
                color: '#000',
                cursor: 'pointer',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              LUX TIME
            </h1>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={shareSite}
              title="Partager le site"
              className="flex items-center gap-1 bg-[#F2EBE0] text-[#7A6145] text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-[#E0D4C0] hover:bg-[#E8DDD0] transition-colors duration-300"
            >
              <i className="fa-solid fa-arrow-up-from-bracket text-[10px]" />
            </button>
            <button
              onClick={toggleCart}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#C5A059] transition-colors duration-300"
            >
              <i className="fa-solid fa-bag-shopping text-[10px]" />
              <span className="text-[10px] font-bold">{cartCount}</span>
            </button>
          </div>

        </div>
      </header>
    </>
  )
}
