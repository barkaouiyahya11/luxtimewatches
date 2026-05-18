'use client'

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/context/StoreContext'
import { GOOGLE_ORDERS_SCRIPT_URL } from '@/lib/constants'

function isValidMoroccanPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-.]/g, '')
  return /^(0[67]\d{8}|(\+212|00212)[67]\d{8})$/.test(cleaned)
}

// ── Confetti ──────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const colors = ['#C5A059', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
    const pieces: {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; angle: number; va: number
    }[] = []

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * 360,
        va: (Math.random() - 0.5) * 10,
      })
    }

    let frame = 0
    let animId: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.4
        p.angle += p.va
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.angle * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - frame / 90)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
        ctx.restore()
      })
      frame++
      if (frame < 100) animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}

export default function CheckoutModal() {
  const { checkout, closeCheckout, cart, clearCart } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [finalTotal, setFinalTotal] = useState(0)

  if (!checkout.isOpen) return null

  const total =
    checkout.mode === 'direct'
      ? (checkout.directProduct?.price ?? 0) * (checkout.directQty ?? 1)
      : cart.reduce((s, i) => s + i.price * i.qty, 0)

  function handleClose() {
    closeCheckout()
    setTimeout(() => {
      setName(''); setPhone(''); setCity('')
      setError(''); setSuccess(false); setSubmitting(false)
    }, 300)
  }

  async function submitOrder() {
    if (submitting) return
    setError('')

    if (!name.trim() || !phone.trim() || !city.trim()) {
      setError('Veuillez remplir tous les champs correctement.')
      return
    }
    if (name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères.')
      return
    }
    if (!isValidMoroccanPhone(phone)) {
      setError('Numéro invalide. Format: 06XXXXXXXX ou 07XXXXXXXX')
      return
    }

    const items =
      checkout.mode === 'direct'
        ? [
            {
              sku: checkout.directProduct!.sku,
              name: checkout.directProduct!.name,
              cat: checkout.directProduct!.cat,
              coffret: checkout.directProduct!.coffret,
              price: checkout.directProduct!.price,
              qty: checkout.directQty ?? 1,
              selectedColor: checkout.directColor,
            },
          ]
        : cart.map((i) => ({
            sku: i.sku,
            name: i.name,
            cat: i.cat,
            coffret: i.coffret,
            price: i.price,
            qty: i.qty,
            selectedColor: i.selectedColor,
          }))

    const orderTotal = items.reduce((s, i) => s + i.price * i.qty, 0)

    function formatItem(it: typeof items[0]) {
      const parts = [
        `[${it.sku}]`,
        it.name,
        it.cat === 'femme' ? '👩 FEMME' : '👨 HOMME',
        it.coffret ? '📦 COFFRET' : '🎁 SIMPLE',
        it.selectedColor ? `🎨 ${it.selectedColor}` : '',
        `x${it.qty} = ${it.price * it.qty} MAD`,
      ]
      return parts.filter(Boolean).join(' | ')
    }

    const payload = {
      type: 'order',
      date: new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' }),
      name: name.trim(),
      phone: phone.trim(),
      address: '',
      city: city.trim(),
      items: items.map(formatItem).join('\n'),
      total: `${orderTotal} MAD`,
      id: Date.now().toString(),
    }

    setSubmitting(true)

    // Afficher le succès immédiatement, envoyer en arrière-plan
    setFinalTotal(orderTotal)
    setSuccess(true)
    clearCart()
    setSubmitting(false)

    // Envoi en arrière-plan (ne bloque pas l'UI)
    fetch(GOOGLE_ORDERS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col relative overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-black uppercase font-serif text-black">
              Détails de Livraison
            </h3>
            <p className="font-arabic text-sm text-gray-400">معلومات التوصيل</p>
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
              {/* Livraison gratuite */}
              <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg py-2.5 px-4">
                <span className="text-green-600 text-lg">🚚</span>
                <div className="text-center">
                  <span className="text-green-700 font-black text-xs uppercase tracking-widest">Livraison GRATUITE</span>
                  <span className="text-green-600 font-arabic text-xs block">التوصيل مجاني</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Nom complet | الإسم الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />
              <input
                type="tel"
                placeholder="Téléphone: 06XXXXXXXX ou 07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />
              <input
                type="text"
                placeholder="Ville | المدينة"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm font-semibold transition"
              />

              {error && (
                <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded">
                  ⚠️ {error}
                </div>
              )}

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center font-bold">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-gray-500 uppercase">Total à payer :</span>
                  <span className="font-arabic text-[11px] text-gray-500">المجموع :</span>
                </div>
                <span className="text-2xl text-black">{total.toFixed(2)} MAD</span>
              </div>

              <button
                onClick={submitOrder}
                disabled={submitting}
                className="btn-shine w-full py-4 font-black uppercase text-[11px] tracking-widest rounded-lg shadow-lg text-white flex flex-col items-center gap-1 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #C5A059 0%, #d4b572 100%)' }}
              >
                <span>CONFIRMER MA COMMANDE</span>
                <span className="font-arabic text-[13px] text-white/90 font-bold">تأكيد الطلب</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 relative">
              {/* Confetti */}
              <Confetti />

              <div className="relative z-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-check text-4xl text-green-500" />
                </div>
                <p className="font-black text-xl text-gray-800 uppercase mb-2">Félicitations !</p>
                <p className="font-arabic text-base text-gray-600 mb-2">
                  لقد تم تسجيل طلبكم بنجاح
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Votre commande a bien été reçue. Notre équipe vous contactera pour la confirmer.
                </p>

                {/* Livraison gratuite dans success */}
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg py-2 px-4 mb-4 inline-flex mx-auto">
                  <span className="text-green-600">🚚</span>
                  <span className="text-green-700 font-black text-xs uppercase tracking-widest">Livraison GRATUITE</span>
                </div>

                <p className="text-xs text-gray-500 font-bold tracking-widest bg-gray-50 py-3 px-6 rounded-lg inline-block border mb-2">
                  Commande envoyée ✓
                </p>
                <p className="text-sm font-black text-black">{finalTotal} MAD</p>
                <button
                  onClick={handleClose}
                  className="mt-8 w-full border-2 border-black text-black py-4 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black hover:text-white transition"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
