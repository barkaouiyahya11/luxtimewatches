'use client'

import { useState, useRef, useCallback } from 'react'

interface Props {
  label?: string
  onUpload: (url: string) => void
  currentUrl?: string
}

export default function VideoUpload({ label = 'Vidéo', onUpload, currentUrl }: Props) {
  const [preview, setPreview] = useState<string>(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    setError('')
    setProgress('Préparation…')

    // Local preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      // 1. Get signed upload params
      setProgress('Signature en cours…')
      const signRes = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType: 'video' }),
      })
      const signData = await signRes.json()
      if (!signRes.ok) throw new Error(signData.error || 'Signature failed')

      // 2. Upload directly to Cloudinary
      setProgress('Upload vidéo…')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'luxtim')
      formData.append('api_key', signData.apiKey)
      formData.append('timestamp', String(signData.timestamp))
      formData.append('signature', signData.signature)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
        { method: 'POST', body: formData }
      )
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || uploadData.error) {
        throw new Error(uploadData.error?.message || 'Upload échoué')
      }

      const url: string = uploadData.secure_url
      setPreview(url)
      onUpload(url)
      setProgress('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur upload')
      setProgress('')
      setPreview('')
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
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${dragging ? 'border-[#C5A059] bg-[#C5A059]/5 scale-[1.01]' : 'border-dashed border-gray-200 hover:border-[#C5A059]'}
          ${preview ? 'aspect-video' : 'h-36'}`}
      >
        {preview ? (
          <>
            <video
              src={preview}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              autoPlay
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                Changer la vidéo
              </span>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400 px-4">
            <div className={`text-3xl transition-transform duration-200 ${dragging ? 'scale-125' : ''}`}>
              {uploading ? '⏳' : '🎬'}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
              {uploading ? progress : 'Cliquer ou glisser une vidéo (MP4)'}
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
        <p className="text-green-600 text-[10px] font-bold truncate">✓ Vidéo uploadée</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/mov,video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
      />
    </div>
  )
}
