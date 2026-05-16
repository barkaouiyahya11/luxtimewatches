import { NextRequest, NextResponse } from 'next/server'
import { GOOGLE_ORDERS_SCRIPT_URL } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const { categorie, description, montant } = await req.json()
    if (!montant || !description) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const payload = {
      type: 'depense',
      date: new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' }),
      categorie,
      description,
      montant: parseFloat(montant),
    }

    await fetch(GOOGLE_ORDERS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Depense error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
