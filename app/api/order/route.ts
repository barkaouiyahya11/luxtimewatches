import { NextRequest, NextResponse } from 'next/server'
import { GOOGLE_ORDERS_SCRIPT_URL } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!GOOGLE_ORDERS_SCRIPT_URL) {
      return NextResponse.json(
        { status: 'error', message: 'GOOGLE_SCRIPT_URL not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(GOOGLE_ORDERS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { raw: text } }

    return NextResponse.json({ status: 'ok', data })
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
