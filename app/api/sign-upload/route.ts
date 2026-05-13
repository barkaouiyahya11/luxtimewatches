import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const { resourceType = 'image' } = await req.json().catch(() => ({}))

    const timestamp = Math.round(new Date().getTime() / 1000)
    const paramsToSign = {
      folder: 'luxtim',
      timestamp,
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      resourceType,
    })
  } catch (err) {
    console.error('Sign upload error:', err)
    return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 })
  }
}
