'use client'

import { useEffect, useState } from 'react'
import { useCountdown } from '@/hooks/useCountdown'

function CountdownBadge({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#7B3F00] text-white text-[9px] font-black px-2 py-0.5 rounded-full mx-1.5">
      ⏰ {time}
    </span>
  )
}

function MarqueeItem({ time }: { time: string }) {
  return (
    <span className="mx-8 md:mx-12 whitespace-nowrap">
      🔥 KHELIK DIMA CLASS M3A LUX TIME
      <span className="mx-3 text-[#C6A769]">✦</span>
      ⌚ ANAQA FAKHIRA B-ATMINA FI L-MOTANAWIL
      <span className="mx-3 text-[#C6A769]">✦</span>
      💎 LIVRAISON GRATUITE F KAMEL L-MAGHRIB 🇲🇦
      <CountdownBadge time={time} />
    </span>
  )
}

export default function AnnouncementBar() {
  const time = useCountdown()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let lastY = 0
    function onScroll() {
      const y = window.scrollY
      setVisible(y < 50 || y < lastY)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="w-full h-[45px] bg-[#efe7dd] border-y border-[#e5ddd3] flex items-center overflow-hidden"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10001,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div className="animate-marquee font-bold uppercase tracking-widest text-[10px] md:text-[13px] text-[#7B3F00]">
        <MarqueeItem time={time} />
        <MarqueeItem time={time} />
      </div>
    </div>
  )
}
