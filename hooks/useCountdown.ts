'use client'

import { useState, useEffect } from 'react'

export function useCountdown() {
  const [time, setTime] = useState('00:00:00')

  useEffect(() => {
    function update() {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(23, 59, 59, 0)
      let diff = midnight.getTime() - now.getTime()
      if (diff < 0) diff = 0
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}
