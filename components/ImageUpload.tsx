'use client'

import { useState, useRef, useCallback } from 'react'

interface Props {
  label?: string
  onUpload: (url: string) => void
  currentUrl?: string
}

// Compress image to max 1400px and JPEG 0.85 quality before upload
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 1400
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width)
          width = MAX
        } else {
          width = Math.round((width * MAX) / height)
          height = MAX
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        'image/jpeg',
        0.85
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file) // fallback: upload original
    }
    img.src = url
  })
}

export default function ImageUpload({ label = 'Image', onUpload, currentUrl }: Props) {
  const [preview, setPreview] = useState<string>(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    setError('')
    setProgress('Compression…')

    // Local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      // Compress before upload
      const compressed = await compressImage(file)
      setProgress('Upload en cours…')

      const formData = new FormData()
      formData.append('file', compressed, 'image.jpg')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })

      // Handle non-JSON responses (413, 500, etc.)
      const text = await res.text()
      let data: { url?: string; error?: string }
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(res.status === 413 ? 'Image trop lourde même après compression' : `Erreur serveur (${res.status})`)
      }

      if (!res.ok || data.error) throw new Error(data.error || 'Upload échoué')

      onUpload(data.url!)
      setPreview(data.url!)
      setProgress('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur upload')
      setProgress('')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) uploadFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${dragging ? 'border-[#C5A059] bg-[#C5A059]/5 scale-[1.01]' : 'border-dashed border-gray-200 hover:border-[#C5A059]'}
          ${preview ? 'aspect-square' : 'h-36'}`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                Changer l'image
              </span>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400 px-4">
            <div className={`text-3xl transition-transform duration-200 ${dragging ? 'scale-125' : ''}`}>
              {uploading ? '⏳' : '📷'}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
              {uploading ? progress : 'Cliquer ou glisser une image'}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                {progress}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-bold">{error}</p>
      )}

      {preview && !uploading && !error && (
        <p className="text-green-600 text-[10px] font-bold truncate">✓ Image uploadée</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*, .heic, .heif, .avif, .webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
      />
    </div>
  )
}
