'use client'

import { useState, useRef, useCallback } from 'react'

interface Props {
  label?: string
  onUpload: (url: string) => void
  currentUrl?: string
}

export default function ImageUpload({ label = 'Image', onUpload, currentUrl }: Props) {
  const [preview, setPreview] = useState<string>(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic') && !file.name.toLowerCase().endsWith('.heif')) {
      setError('Fichier invalide — sélectionnez une image.')
      return
    }

    setUploading(true)
    setError('')

    // Local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || data.error) throw new Error(data.error || 'Upload échoué')

      onUpload(data.url)
      setPreview(data.url)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur upload')
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
              {uploading ? 'Upload en cours…' : 'Cliquer ou glisser une image'}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                Upload…
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-bold">{error}</p>
      )}

      {preview && !uploading && (
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
