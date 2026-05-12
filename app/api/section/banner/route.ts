import { NextRequest, NextResponse } from 'next/server'

const GITHUB_OWNER = 'barkaouiyahya11'
const GITHUB_REPO = 'luxtimewatches'
const FILE_PATH = 'components/GoldBanner.tsx'
const GITHUB_API = 'https://api.github.com'

export async function POST(req: NextRequest) {
  try {
    const { img1, img2, img3 } = await req.json()
    if (!img1 && !img2 && !img3) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    // 1. Get current file from GitHub
    const fileRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers }
    )
    if (!fileRes.ok) {
      const err = await fileRes.json()
      return NextResponse.json({ error: `GitHub fetch error: ${err.message}` }, { status: 500 })
    }

    const fileData = await fileRes.json()
    const sha: string = fileData.sha
    let content = Buffer.from(fileData.content, 'base64').toString('utf-8')

    // 2. Replace BANNER_IMAGES block
    const newImages = []
    if (img1) newImages.push(`  {\n    src: '${img1}',\n    alt: 'GUSHKIN Collection 1',\n  }`)
    if (img2) newImages.push(`  {\n    src: '${img2}',\n    alt: 'GUSHKIN Luxe',\n  }`)
    if (img3) newImages.push(`  {\n    src: '${img3}',\n    alt: 'GUSHKIN Prestige',\n  }`)

    // Only update provided images — keep existing ones for unprovided slots
    // Extract current srcs
    const srcMatches = [...content.matchAll(/src:\s*'([^']+)'/g)]
    const currentSrcs = srcMatches.map((m) => m[1])

    const finalImg1 = img1 || currentSrcs[0] || ''
    const finalImg2 = img2 || currentSrcs[1] || ''
    const finalImg3 = img3 || currentSrcs[2] || ''

    const newBlock = `const BANNER_IMAGES = [
  {
    src: '${finalImg1}',
    alt: 'GUSHKIN Collection 1',
  },
  {
    src: '${finalImg2}',
    alt: 'GUSHKIN Luxe',
  },
  {
    src: '${finalImg3}',
    alt: 'GUSHKIN Prestige',
  },
]`

    content = content.replace(
      /const BANNER_IMAGES\s*=\s*\[[\s\S]*?\]/m,
      newBlock
    )

    // 3. Commit back to GitHub
    const commitRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update GoldBanner images via admin dashboard',
          content: Buffer.from(content).toString('base64'),
          sha,
        }),
      }
    )

    if (!commitRes.ok) {
      const err = await commitRes.json()
      return NextResponse.json({ error: `GitHub commit error: ${err.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Update GoldBanner error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
