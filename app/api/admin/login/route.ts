import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const attempts = new Map<string, { count: number; until: number }>()

function getIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function makeToken(secret: string): string {
  const ts = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', secret).update(String(ts)).digest('hex')
  return Buffer.from(`${ts}:${sig}`).toString('base64url')
}

export function verifyToken(token: string, secret: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [tsStr, sig] = decoded.split(':')
    const ts = parseInt(tsStr)
    if (isNaN(ts)) return false
    const age = Math.floor(Date.now() / 1000) - ts
    if (age > 28800) return false // 8h expiry
    const expected = createHmac('sha256', secret).update(tsStr).digest('hex')
    return sig === expected
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const now = Date.now()

  const record = attempts.get(ip)
  if (record && record.until > now) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429 }
    )
  }

  const { password } = await req.json()
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  const ADMIN_SECRET   = process.env.ADMIN_SECRET

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  if (password !== ADMIN_PASSWORD) {
    const current = record ?? { count: 0, until: 0 }
    current.count++
    current.until = current.count >= 5 ? now + 15 * 60 * 1000 : 0
    attempts.set(ip, current)
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  attempts.delete(ip)
  const token = makeToken(ADMIN_SECRET)
  return NextResponse.json({ token })
}
