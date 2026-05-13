'use client'

import { useEffect } from 'react'

export default function NoDownload() {
  useEffect(() => {
    // Bloquer clic droit sur toute la page (desktop)
    const blockContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Bloquer drag des images (desktop)
    const blockDrag = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault()
      }
    }

    // Bloquer Ctrl+S / Cmd+S et Ctrl+U (desktop)
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'u')) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('keydown', blockKeys)

    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  return null
}
