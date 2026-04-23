'use client'

import { useCountdown } from '@/hooks/useCountdown'

function CountdownBadge({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#c2410c] text-white text-[9px] font-black px-2 py-0.5 rounded-full mx-1.5">
      ⏰ {time}
    </span>
  )
}

function MarqueeItem({ time }: { time: string }) {
  return (
    <span className="mx-8 md:mx-12 whitespace-nowrap">
      ⏱️ OFFRE LIMITÉE : JUSQU&apos;À -30% + LIVRAISON GRATUITE AU MAROC 🇲🇦
      <CountdownBadge time={time} />|{' '}
      <span className="font-arabic text-[10px] md:text-[12px]">
        عرض محدود: خصم -30% + التوصيل مجانا 🇲🇦
      </span>
    </span>
  )
}

export default function AnnouncementBar() {
  const time = useCountdown()

  return (
    <div className="fixed top-0 left-0 w-full z-[1001] h-[35px] bg-[#efe7dd] border-b border-[#e5ddd3] flex items-center overflow-hidden">
      <div className="animate-marquee font-bold uppercase tracking-widest text-[7.5px] md:text-[9px] text-black">
        <MarqueeItem time={time} />
        <MarqueeItem time={time} />
      </div>
    </div>
  )
}
