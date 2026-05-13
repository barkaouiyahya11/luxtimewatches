import { NextRequest, NextResponse } from 'next/server'

const GITHUB_OWNER = 'barkaouiyahya11'
const GITHUB_REPO = 'luxtimewatches'
const FILE_PATH = 'components/Hero.tsx'
const GITHUB_API = 'https://api.github.com'

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json()
    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 })
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

    content = content.replace(
      /const VIDEO_URL\s*=\s*'[^']*'/,
      `const VIDEO_URL = '${videoUrl}'`
    )

    const commitRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update Hero video via admin dashboard',
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
    console.error('Update Hero error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
