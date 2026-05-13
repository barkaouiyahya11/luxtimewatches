'use client'

import { useEffect } from 'react'

export default function NoDownload() {
  useEffect(() => {
    // ── Bloquer clic droit sur toute la page ──
    const blockContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // ── Bloquer drag des images et vidéos ──
    const blockDrag = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('img, video')
      ) {
        e.preventDefault()
        return false
      }
    }

    // ── Bloquer Ctrl+S / Cmd+S (sauvegarder) et Ctrl+U (source) ──
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'u')) {
        e.preventDefault()
        return false
      }
    }

    // ── Bloquer touch long-press sur mobile (Android) ──
    const blockTouchHold = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('keydown', blockKeys)
    document.addEventListener('touchstart', blockTouchHold, { passive: false })

    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('keydown', blockKeys)
      document.removeEventListener('touchstart', blockTouchHold)
    }
  }, [])

  return null
}
