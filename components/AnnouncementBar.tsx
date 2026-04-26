'use client'

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
    <div className="w-full h-[45px] bg-[#efe7dd] border-y border-[#e5ddd3] flex items-center overflow-hidden">
      <div className="animate-marquee font-bold uppercase tracking-widest text-[10px] md:text-[13px] text-[#7B3F00]">
        <MarqueeItem time={time} />
        <MarqueeItem time={time} />
      </div>
    </div>
  )
}
