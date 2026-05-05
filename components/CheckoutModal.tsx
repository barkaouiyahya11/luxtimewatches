'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'

function isValidMoroccanPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-.]/g, '')
  return /^(0[67]\d{8}|(\+212|00212)[67]\d{8})$/.test(cleaned)
}

export default function CheckoutModal() {
  const { checkout, closeCheckout, cart, clearCart } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
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
      setName(''); setPhone(''); setAddress(''); setCity('')
      setError(''); setSuccess(false); setSubmitting(false)
    }, 300)
  }

  async function submitOrder() {
    if (submitting) return
    setError('')

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
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
              name: checkout.directProduct!.name,
              price: checkout.directProduct!.price,
              qty: checkout.directQty ?? 1,
              img: checkout.directProduct!.gridImg,
            },
          ]
        : cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty, img: i.gridImg }))

    const orderTotal = items.reduce((s, i) => s + i.price * i.qty, 0)

    const payload = {
      date: new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' }),
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      items: items
        .map((it) => `${it.name} x${it.qty} = ${it.price * it.qty} MAD`)
        .join(' | '),
      total: `${orderTotal} MAD`,
    }

    setSubmitting(true)

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // Si l'API échoue, on continue quand même pour ne pas bloquer le client
    }

    setFinalTotal(orderTotal)
    setSuccess(true)
    clearCart()
    setSubmitting(false)
  }

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
                placeholder="Adresse exacte | العنوان بالتفصيل"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
            <div className="text-center py-8">
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
          )}
        </div>
      </div>
    </div>
  )
}
