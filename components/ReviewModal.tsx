'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { WHATSAPP_NUMBER, GOOGLE_SCRIPT_URL } from '@/lib/constants'

export default function ReviewModal() {
  const { isReviewOpen, closeReview } = useStore()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isReviewOpen) return null

  function handleClose() {
    closeReview()
    setTimeout(() => {
      setRating(0); setHovered(0); setName(''); setCity('')
      setEmail(''); setText(''); setError(false); setSuccess(false)
    }, 300)
  }

  function submit() {
    if (!name.trim() || !city.trim() || !email.trim() || !text.trim() || rating === 0) {
      setError(true)
      return
    }
    setError(false)

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
    const now = new Date().toLocaleString('fr-FR')

    // Send to Google Sheets if configured
    if (GOOGLE_SCRIPT_URL) {
      const formData = new URLSearchParams()
      formData.append('DATE', now)
      formData.append('NOM', name)
      formData.append('Ville', city)
      formData.append('Email', email)
      formData.append('Note', stars)
      formData.append('Avis', text)
      formData.append('Statut', 'EN ATTENTE')
      formData.append('Type', 'AVIS_CLIENT')
      fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData }).catch(() => {})
    }

    // Notify owner via WhatsApp
    const maskedEmail = email.replace(/@.*/, '@...')
    const msg =
      `⭐ *NOUVEL AVIS CLIENT - LUX TIME*%0A` +
      `──────────────────────%0A` +
      `👤 Nom    : *${name}*%0A` +
      `🏙️ Ville  : ${city}%0A` +
      `📧 Email  : ${email}%0A` +
      `⭐ Note   : ${stars}%0A` +
      `──────────────────────%0A` +
      `💬 Avis   : ${text}%0A` +
      `──────────────────────%0A` +
      `📋 *Pour publier dans data/reviews.ts :*%0A` +
      `{ name:"${name}", city:"${city}", rating:${rating}, text:"${text}", email:"${maskedEmail}" }`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setSuccess(true)
  }

  const displayRating = hovered || rating

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-black uppercase font-serif text-black">Votre avis</h3>
            <p className="font-arabic text-sm text-gray-400">شاركنا رأيك</p>
          </div>
          <button
            onClick={handleClose}
            className="text-2xl text-gray-300 hover:text-black w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 pb-6 pt-4">
          {!success ? (
            <div className="space-y-4">
              {/* Star rating */}
              <div className="text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Note</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className="text-3xl cursor-pointer transition select-none"
                      style={{ color: v <= displayRating ? '#f59e0b' : '#d1d5db' }}
                      onMouseEnter={() => setHovered(v)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(v)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Votre prénom | اسمك"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />
              <input
                type="text"
                placeholder="Votre ville | مدينتك"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />
              <input
                type="email"
                placeholder="Email (non publié)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />
              <textarea
                placeholder="Votre avis... | رأيك..."
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition resize-none"
              />

              {error && (
                <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded">
                  ⚠️ Veuillez remplir tous les champs et choisir une note.
                </div>
              )}

              <button
                onClick={submit}
                className="btn-shine w-full py-4 font-black uppercase text-[11px] tracking-widest rounded-lg shadow-lg text-white"
                style={{ background: 'linear-gradient(135deg, #C5A059 0%, #d4b572 100%)' }}
              >
                Envoyer mon avis —{' '}
                <span className="font-arabic text-[13px]">إرسال</span>
              </button>
              <p className="text-[9px] text-gray-400 text-center">
                Votre avis sera vérifié avant publication.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-3xl text-green-500" />
              </div>
              <p className="font-black text-lg text-gray-800 uppercase mb-2">Merci !</p>
              <p className="text-gray-500 text-[12px]">
                Votre avis a été envoyé. Il sera publié après vérification.
              </p>
              <p className="font-arabic text-gray-400 text-[13px] mt-1">
                تم استلام تقييمك وسيُنشر بعد المراجعة
              </p>
              <button
                onClick={handleClose}
                className="mt-6 border-2 border-black text-black px-8 py-3 text-[10px] font-black uppercase rounded-lg hover:bg-black hover:text-white transition"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
