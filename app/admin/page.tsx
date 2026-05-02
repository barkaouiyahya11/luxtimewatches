'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

const ADMIN_PASSWORD = 'luxtim2024'

interface ColorVariant {
  name: string
  img: string
}

interface ProductForm {
  name: string
  sku: string
  cat: 'femme' | 'homme'
  price: string
  originalPrice: string
  stock: string
  gridImg: string
  detailImg1: string
  detailImg2: string
  hot: boolean
  coffret: boolean
  colors: ColorVariant[]
}

const EMPTY: ProductForm = {
  name: '',
  sku: '',
  cat: 'femme',
  price: '',
  originalPrice: '',
  stock: '',
  gridImg: '',
  detailImg1: '',
  detailImg2: '',
  hot: false,
  coffret: false,
  colors: [],
}

function generateCode(form: ProductForm, id: number): string {
  const detailImgs = [form.detailImg1, form.detailImg2].filter(Boolean)
  const validColors = form.colors.filter((c) => c.name && c.img)
  const colorsCode = validColors.length > 0
    ? `\n    colors: [\n${validColors.map((c) => `      { name: '${c.name}', img: '${c.img}' }`).join(',\n')},\n    ],`
    : ''
  return `  {
    id: ${id},
    sku: '${form.sku}',
    cat: '${form.cat}',
    name: '${form.name}',
    price: ${form.price},
    originalPrice: ${form.originalPrice},
    stock: ${form.stock},
    rating: 4.9,
    reviews: 0,
    gridImg: '${form.gridImg}',
    detailImgs: [
${detailImgs.map((u) => `      '${u}'`).join(',\n')},
    ],${form.hot ? '\n    hot: true,' : ''}${form.coffret ? '\n    coffret: true,' : ''}${colorsCode}
  },`
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState<ProductForm>(EMPTY)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [nextId, setNextId] = useState(100)
  const [tab, setTab] = useState<'product' | 'banner' | 'cartes'>('product')
  const [banner, setBanner] = useState({ img1: '', img2: '', img3: '' })
  const [bannerCode, setBannerCode] = useState('')
  const [bannerCopied, setBannerCopied] = useState(false)
  const [cartes, setCartes] = useState({ simple: '', coffret: '' })
  const [cartesCode, setCartesCode] = useState('')
  const [cartesCopied, setCartesCopied] = useState(false)
  const router = useRouter()

  function generateBannerCode() {
    if (!banner.img1 && !banner.img2 && !banner.img3) {
      alert('Uploadez au moins une image')
      return
    }
    const current = [
      'https://i.ibb.co/W4ZCgmbC/Whats-App-Image-2026-03-27-at-20-25-56.jpg',
      'https://i.ibb.co/dwDPGFXf/Whats-App-Image-2026-03-23-at-18-02-06-1.jpg',
      'https://i.ibb.co/DfJh70n6/Gemini-Generated-Image-rdy4m6rdy4m6rdy4-1.png',
    ]
    const code = `Dans components/GoldBanner.tsx, remplacez BANNER_IMAGES par :

const BANNER_IMAGES = [
  { src: '${banner.img1 || current[0]}', alt: 'LUX TIME Banner 1' },
  { src: '${banner.img2 || current[1]}', alt: 'LUX TIME Banner 2' },
  { src: '${banner.img3 || current[2]}', alt: 'LUX TIME Banner 3' },
]`
    setBannerCode(code)
  }

  async function copyBannerCode() {
    await navigator.clipboard.writeText(bannerCode)
    setBannerCopied(true)
    setTimeout(() => setBannerCopied(false), 2000)
  }

  function generateCartesCode() {
    if (!cartes.simple && !cartes.coffret) {
      alert('Uploadez au moins une image')
      return
    }
    const currentSimple = 'https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg'
    const currentCoffret = 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777675221/luxtim/espf5fbjdccmvejteldv.jpg'
    const code = `Dans components/HommeSection.tsx, remplacez les 2 lignes CARD_SIMPLE et CARD_COFFRET par :

const CARD_SIMPLE = '${cartes.simple || currentSimple}'
const CARD_COFFRET = '${cartes.coffret || currentCoffret}'`
    setCartesCode(code)
  }

  async function copyCartesCode() {
    await navigator.clipboard.writeText(cartesCode)
    setCartesCopied(true)
    setTimeout(() => setCartesCopied(false), 2000)
  }

  function login() {
    if (password === ADMIN_PASSWORD) setAuth(true)
    else alert('Mot de passe incorrect')
  }

  function set(field: keyof ProductForm, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function generate() {
    if (!form.name || !form.price || !form.gridImg) {
      alert('Remplissez au minimum : nom, prix et image principale')
      return
    }
    const code = generateCode(form, nextId)
    setGeneratedCode(code)
    setNextId((n) => n + 1)
  }

  async function copyCode() {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setForm(EMPTY)
    setGeneratedCode('')
  }

  // ── Login screen ─────────────────────────────────────
  if (!auth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl text-white text-center tracking-widest uppercase mb-8">
            LUX TIME<br />
            <span className="text-[#C5A059] text-lg">Admin</span>
          </h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              className="bg-black border border-white/20 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-[#C5A059] transition"
              placeholder="••••••••"
              autoFocus
            />
            <button
              onClick={login}
              className="bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest py-3 rounded-lg hover:bg-[#d4b572] transition"
            >
              Accéder au dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-xl tracking-widest uppercase">
            LUX TIME <span className="text-[#C5A059]">Admin</span>
          </h1>
          <span className="text-[9px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            Connecté
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition px-4 py-2 rounded-lg border border-white/10 hover:border-white/30"
          >
            ← Voir le site
          </button>
          <button
            onClick={() => setAuth(false)}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-400 transition"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setTab('product')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'product'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🛍️ Ajouter un produit
          </button>
          <button
            onClick={() => setTab('banner')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'banner'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🖼️ Modifier le Cadre
          </button>
          <button
            onClick={() => setTab('cartes')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'cartes'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🃏 Photos des Cartes Homme
          </button>
        </div>

        {/* Banner Tab */}
        {tab === 'banner' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Modifier le Cadre (Bannière)
              </h2>
              <p className="text-gray-500 text-sm">
                Uploadez les nouvelles photos pour les 3 cercles de la bannière principale
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  📷 3 Photos du cadre
                </h3>
                <ImageUpload
                  label="Photo cercle 1 (gauche)"
                  onUpload={(url) => setBanner((b) => ({ ...b, img1: url }))}
                  currentUrl={banner.img1}
                />
                <ImageUpload
                  label="Photo cercle 2 (centre)"
                  onUpload={(url) => setBanner((b) => ({ ...b, img2: url }))}
                  currentUrl={banner.img2}
                />
                <ImageUpload
                  label="Photo cercle 3 (droite)"
                  onUpload={(url) => setBanner((b) => ({ ...b, img3: url }))}
                  currentUrl={banner.img3}
                />
                <button
                  onClick={generateBannerCode}
                  className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition"
                >
                  ⚡ Générer le code
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                    📋 Comment utiliser
                  </h3>
                  <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                    <li>Uploadez 1, 2 ou 3 nouvelles photos</li>
                    <li>Cliquez sur <strong className="text-white">Générer le code</strong></li>
                    <li>Copiez et collez dans Antigravity</li>
                    <li>Antigravity met à jour et déploie</li>
                  </ol>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Code généré
                    </span>
                    {bannerCode && (
                      <button
                        onClick={copyBannerCode}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${
                          bannerCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'
                        }`}
                      >
                        {bannerCopied ? '✓ Copié !' : 'Copier'}
                      </button>
                    )}
                  </div>
                  <div className="p-5 min-h-[200px]">
                    {bannerCode ? (
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {bannerCode}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-600 py-10">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-center">
                          Le code apparaîtra ici
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cartes Homme Tab */}
        {tab === 'cartes' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Photos des Cartes Homme
              </h2>
              <p className="text-gray-500 text-sm">
                Changez les photos des 2 grandes cartes &quot;Boite Simple&quot; et &quot;Avec Coffret&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  📷 2 Photos des cartes
                </h3>
                <ImageUpload
                  label="Photo carte BOITE SIMPLE (gauche)"
                  onUpload={(url) => setCartes((c) => ({ ...c, simple: url }))}
                  currentUrl={cartes.simple}
                />
                <ImageUpload
                  label="Photo carte AVEC COFFRET (droite)"
                  onUpload={(url) => setCartes((c) => ({ ...c, coffret: url }))}
                  currentUrl={cartes.coffret}
                />
                <button
                  onClick={generateCartesCode}
                  className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition"
                >
                  ⚡ Générer le code
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                    📋 Comment utiliser
                  </h3>
                  <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                    <li>Uploadez la nouvelle photo pour chaque carte</li>
                    <li>Cliquez sur <strong className="text-white">Générer le code</strong></li>
                    <li>Copiez et collez dans Antigravity</li>
                    <li>Antigravity met à jour et déploie</li>
                  </ol>
                </div>

                {/* Aperçu cartes actuelles */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                    👁️ Aperçu actuel
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-500">Boite Simple</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cartes.simple || 'https://i.ibb.co/jknKzLpC/Whats-App-Image-2026-03-23-at-18-03-34.jpg'}
                        alt="simple"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-500">Avec Coffret</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cartes.coffret || 'https://res.cloudinary.com/dannr2e0c/image/upload/v1777675221/luxtim/espf5fbjdccmvejteldv.jpg'}
                        alt="coffret"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Code généré
                    </span>
                    {cartesCode && (
                      <button
                        onClick={copyCartesCode}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${
                          cartesCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'
                        }`}
                      >
                        {cartesCopied ? '✓ Copié !' : 'Copier'}
                      </button>
                    )}
                  </div>
                  <div className="p-5 min-h-[150px]">
                    {cartesCode ? (
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {cartesCode}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-600 py-8">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-center">
                          Le code apparaîtra ici
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Tab */}
        {tab === 'product' && (
        <><div className="mb-10">
          <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
            Ajouter un produit
          </h2>
          <p className="text-gray-500 text-sm">
            Uploadez vos images, remplissez les infos, puis copiez le code généré dans{' '}
            <code className="text-[#C5A059] bg-white/5 px-2 py-0.5 rounded text-xs">
              data/products.ts
            </code>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left: Form ── */}
          <div className="flex flex-col gap-6">

            {/* Images */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                📷 Images Cloudinary
              </h3>

              <ImageUpload
                label="Image principale (gridImg)"
                onUpload={(url) => set('gridImg', url)}
                currentUrl={form.gridImg}
              />
              <ImageUpload
                label="Image détail 1"
                onUpload={(url) => set('detailImg1', url)}
                currentUrl={form.detailImg1}
              />
              <ImageUpload
                label="Image détail 2"
                onUpload={(url) => set('detailImg2', url)}
                currentUrl={form.detailImg2}
              />
            </div>

            {/* Infos produit */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                📝 Informations produit
              </h3>

              {/* Nom */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Nom du produit *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition"
                  placeholder="LUX TIME ROSE GOLD"
                />
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  SKU
                </label>
                <input
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                  className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition"
                  placeholder="LTF-007"
                />
              </div>

              {/* Catégorie */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Catégorie *
                </label>
                <div className="flex gap-3">
                  {(['femme', 'homme'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => set('cat', c)}
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition
                        ${form.cat === c
                          ? 'bg-[#C5A059] text-black'
                          : 'bg-black/50 border border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition"
                    placeholder="149"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Prix original
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)}
                    className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition"
                    placeholder="249"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition"
                  placeholder="5"
                />
              </div>

              {/* HOT + COFFRET */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Badge HOT
                  </label>
                  <button
                    onClick={() => set('hot', !form.hot)}
                    className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition
                      ${form.hot
                        ? 'bg-red-500 text-white'
                        : 'bg-black/50 border border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                  >
                    {form.hot ? '🔥 HOT activé' : 'Activer HOT'}
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Avec Coffret
                  </label>
                  <button
                    onClick={() => set('coffret', !form.coffret)}
                    className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition
                      ${form.coffret
                        ? 'bg-[#C5A059] text-black'
                        : 'bg-black/50 border border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                  >
                    {form.coffret ? '🎁 Coffret activé' : 'Activer Coffret'}
                  </button>
                </div>
              </div>
            </div>

            {/* Couleurs / Variantes */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  🎨 Variantes de couleur
                </h3>
                <button
                  onClick={() => setForm((f) => ({ ...f, colors: [...f.colors, { name: '', img: '' }] }))}
                  className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/40 px-3 py-1.5 rounded-lg hover:bg-[#C5A059]/10 transition"
                >
                  + Ajouter
                </button>
              </div>

              {form.colors.length === 0 && (
                <p className="text-gray-600 text-[10px] text-center py-2">
                  Aucune couleur — cliquez sur &quot;+ Ajouter&quot; pour créer des variantes
                </p>
              )}

              {form.colors.map((c, i) => (
                <div key={i} className="flex flex-col gap-3 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400">Couleur {i + 1}</span>
                    <button
                      onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((_, j) => j !== i) }))}
                      className="text-red-400 text-[10px] font-black hover:text-red-300"
                    >
                      ✕ Supprimer
                    </button>
                  </div>
                  <input
                    value={c.name}
                    onChange={(e) => setForm((f) => ({
                      ...f,
                      colors: f.colors.map((col, j) => j === i ? { ...col, name: e.target.value } : col)
                    }))}
                    placeholder="ex: GRIS TABLEAU NOIR"
                    className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition uppercase"
                  />
                  <ImageUpload
                    label={`Photo pour "${c.name || `Couleur ${i + 1}`}"`}
                    onUpload={(url) => setForm((f) => ({
                      ...f,
                      colors: f.colors.map((col, j) => j === i ? { ...col, img: url } : col)
                    }))}
                    currentUrl={c.img}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={generate}
                className="flex-1 py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition shadow-lg"
              >
                ⚡ Générer le code
              </button>
              <button
                onClick={reset}
                className="px-5 py-4 border border-white/10 text-gray-400 font-black uppercase text-[11px] tracking-widest rounded-xl hover:border-white/30 hover:text-white transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* ── Right: Generated Code ── */}
          <div className="flex flex-col gap-6">

            {/* Instructions */}
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                📋 Comment utiliser
              </h3>
              <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                <li>Uploadez les images depuis votre ordinateur (glisser ou cliquer)</li>
                <li>Remplissez les informations du produit</li>
                <li>Cliquez sur <strong className="text-white">Générer le code</strong></li>
                <li>Copiez le code généré</li>
                <li>Collez-le dans <code className="text-[#C5A059]">data/products.ts</code> avant le <code className="text-[#C5A059]">]</code> final</li>
                <li>Sauvegardez et déployez</li>
              </ol>
            </div>

            {/* Code output */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Code généré — <code className="text-[#C5A059]">data/products.ts</code>
                </span>
                {generatedCode && (
                  <button
                    onClick={copyCode}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition
                      ${copied
                        ? 'bg-green-500 text-white'
                        : 'bg-[#C5A059] text-black hover:bg-[#d4b572]'
                      }`}
                  >
                    {copied ? '✓ Copié !' : 'Copier'}
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 min-h-[300px]">
                {generatedCode ? (
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[500px]">
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🖊️</div>
                      <p className="text-[11px] font-bold uppercase tracking-widest">
                        Le code apparaîtra ici
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* URL checker */}
            {form.gridImg && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                  🔗 URLs Cloudinary
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'gridImg', url: form.gridImg },
                    { label: 'detailImg1', url: form.detailImg1 },
                    { label: 'detailImg2', url: form.detailImg2 },
                  ]
                    .filter((i) => i.url)
                    .map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-gray-500 w-20 shrink-0">
                          {item.label}
                        </span>
                        <span className="text-green-400 text-[10px] truncate">✓ {item.url.slice(0, 50)}…</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </>)}
      </div>
    </div>
  )
}
