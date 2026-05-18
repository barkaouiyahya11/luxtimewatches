import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export function verifyAdminToken(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') ?? ''
  const secret = process.env.ADMIN_SECRET
  if (!secret || !token) return false
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [tsStr, sig] = decoded.split(':')
    const ts = parseInt(tsStr)
    if (isNaN(ts)) return false
    if (Math.floor(Date.now() / 1000) - ts > 28800) return false
    const expected = createHmac('sha256', secret).update(tsStr).digest('hex')
    return sig === expected
  } catch {
    return false
  }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
}
