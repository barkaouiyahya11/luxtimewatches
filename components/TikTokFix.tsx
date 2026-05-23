'use client'

import { useEffect } from 'react'

/**
 * Fix pour le navigateur intégré TikTok :
 * 1. Empêche le bouton "retour" de fermer le site en ajoutant une entrée dans l'historique
 * 2. Détecte le navigateur TikTok et adapte le comportement
 */
export default function TikTokFix() {
  useEffect(() => {
    // Ajoute une entrée dans l'historique au chargement
    // Ainsi "retour" revient à cette entrée au lieu de fermer le navigateur TikTok
    if (window.history.length <= 1) {
      window.history.pushState({ tiktok: true }, '', window.location.href)
    }
  }, [])

  return null
}
