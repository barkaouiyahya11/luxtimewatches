import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorized } from '@/lib/admin-auth'

const GITHUB_OWNER = 'barkaouiyahya11'
const GITHUB_REPO = 'luxtimewatches'
const FILE_PATH = 'data/products.ts'
const GITHUB_API = 'https://api.github.com'

// Replace a product block in the file content by its ID
function replaceProductBlock(content: string, productId: number, newBlock: string): string {
  const lines = content.split('\n')

  // Find the line containing `id: ${productId},`
  const idLineIdx = lines.findIndex((l) =>
    new RegExp(`^\\s+id:\\s*${productId},\\s*$`).test(l)
  )
  if (idLineIdx === -1) return content

  // Search backwards for the opening `  {`
  let startIdx = idLineIdx - 1
  while (startIdx >= 0 && lines[startIdx].trim() !== '{') startIdx--
  if (startIdx < 0) return content

  // Search forwards tracking brace depth to find matching `  },`
  let depth = 0
  let endIdx = startIdx
  for (let i = startIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') depth++
      else if (ch === '}') depth--
    }
    if (depth === 0 && i > startIdx) {
      endIdx = i
      break
    }
  }

  const newLines = newBlock.trimEnd().split('\n')
  return [
    ...lines.slice(0, startIdx),
    ...newLines,
    ...lines.slice(endIdx + 1),
  ].join('\n')
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorized()
  try {
    const { productId, newBlock } = await req.json()

    if (!productId || !newBlock) {
      return NextResponse.json({ error: 'Missing productId or newBlock' }, { status: 400 })
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
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')

    // 2. Replace the product block
    const updatedContent = replaceProductBlock(currentContent, Number(productId), newBlock)

    if (updatedContent === currentContent) {
      return NextResponse.json({ error: `Product id ${productId} not found in file` }, { status: 404 })
    }

    // 3. Commit back to GitHub
    const commitRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Update product id:${productId} via admin dashboard`,
          content: Buffer.from(updatedContent).toString('base64'),
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
    console.error('Update product error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
