'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import VideoUpload from '@/components/VideoUpload'
import { products } from '@/data/products'

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
  frame: boolean
  imgScale: number
  imgPosition: string
  colors: ColorVariant[]
}

// ── Auto-génération de la référence SKU ─────────────────
function computeSku(cat: 'femme' | 'homme', coffret: boolean): string {
  const prefix = `GSH-${cat === 'femme' ? 'F' : 'H'}-${coffret ? 'CP' : 'BS'}`
  const existing = products
    .filter((p) => p.sku && p.sku.startsWith(prefix))
    .map((p) => parseInt(p.sku.split('-').pop() || '0'))
    .filter((n) => !isNaN(n))
  const max = existing.length > 0 ? Math.max(...existing) : 0
  return `${prefix}-${String(max + 1).padStart(2, '0')}`
}

const EMPTY: ProductForm = {
  name: '',
  sku: computeSku('femme', false),
  cat: 'femme',
  price: '',
  originalPrice: '',
  stock: '',
  gridImg: '',
  detailImg1: '',
  detailImg2: '',
  hot: false,
  coffret: false,
  frame: false,
  imgScale: 1,
  imgPosition: 'center',
  colors: [],
}

function generateCode(form: ProductForm, id: number): string {
  const detailImgs = [form.detailImg1, form.detailImg2].filter(Boolean)
  const validColors = form.colors.filter((c) => c.name && c.img)
  const colorsCode = validColors.length > 0
    ? `\n    colors: [\n${validColors.map((c) => `      { name: '${c.name}', img: '${c.img}' }`).join(',\n')},\n    ],`
    : ''
  
  const detailImgsCode = detailImgs.length > 0
    ? `\n${detailImgs.map((u) => `      '${u}'`).join(',\n')},`
    : ''

  const priceVal = form.price || '0'
  const originalPriceVal = form.originalPrice || priceVal
  const stockVal = form.stock || '0'

  return `  {
    id: ${id},
    sku: '${form.sku}',
    cat: '${form.cat}',
    name: '${form.name}',
    price: ${priceVal},
    originalPrice: ${originalPriceVal},
    stock: ${stockVal},
    rating: 4.9,
    reviews: 0,
    gridImg: '${form.gridImg}',
    detailImgs: [${detailImgsCode}
    ],${form.hot ? '\n    hot: true,' : ''}${form.coffret ? '\n    coffret: true,' : ''}${form.frame ? '\n    frame: true,' : ''}${form.imgScale !== 1 ? `\n    imgScale: ${form.imgScale},` : ''}${form.imgPosition !== 'center' ? `\n    imgPosition: '${form.imgPosition}',` : ''}${colorsCode}
  },`
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState<ProductForm>(EMPTY)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [nextId, setNextId] = useState(() => Math.max(0, ...products.map((p) => p.id)) + 1)
  const [skuManual, setSkuManual] = useState(false)
  const [tab, setTab] = useState<'product' | 'edit' | 'banner' | 'cartes' | 'cartesfemme' | 'colors' | 'vitrine' | 'showcase' | 'hero'>('product')
  const [addSaving, setAddSaving] = useState(false)
  const [addSaveStatus, setAddSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [addSaveMsg, setAddSaveMsg] = useState('')

  // ── Edit product state ──────────────────────────────────
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editOriginalPrice, setEditOriginalPrice] = useState('')
  const [editGridImg, setEditGridImg] = useState('')
  const [editDetailImg1, setEditDetailImg1] = useState('')
  const [editDetailImg2, setEditDetailImg2] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editCopied, setEditCopied] = useState(false)
  const [editSearch, setEditSearch] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editSaveStatus, setEditSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [editSaveMsg, setEditSaveMsg] = useState('')
  const [banner, setBanner] = useState({ img1: '', img2: '', img3: '' })
  const [bannerCode, setBannerCode] = useState('')
  const [bannerCopied, setBannerCopied] = useState(false)
  const [bannerSaving, setBannerSaving] = useState(false)
  const [bannerStatus, setBannerStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [cartes, setCartes] = useState({ simple: '', coffret: '' })
  const [cartesCode, setCartesCode] = useState('')
  const [cartesCopied, setCartesCopied] = useState(false)
  const [cartesFemme, setCartesFemme] = useState({ simple: '', coffret: '' })
  const [cartesFemmeCode, setCartesFemmeCode] = useState('')
  const [cartesFemmeCopied, setCartesFemmeCopied] = useState(false)
  const [cartesFemmeSaving, setCartesFemmeSaving] = useState(false)
  const [cartesFemmeStatus, setCartesFemmeStatus] = useState<'idle' | 'success' | 'error'>('idle')
  // Showcase section
  const [showcaseImg, setShowcaseImg] = useState('')
  const [showcaseCode, setShowcaseCode] = useState('')
  const [showcaseCopied, setShowcaseCopied] = useState(false)

  // Hero / Accueil section
  const [heroVideoUrl, setHeroVideoUrl] = useState('')
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroStatus, setHeroStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Vitrine section
  const [vitrineImg, setVitrineImg] = useState('')
  const [vitrineCode, setVitrineCode] = useState('')
  const [vitrineCopied, setVitrineCopied] = useState(false)

  // Colors editor
  const [editProductId, setEditProductId] = useState('')
  const [editColors, setEditColors] = useState<ColorVariant[]>([])
  const [colorsCode, setColorsCode] = useState('')
  const [colorsCopied, setColorsCopied] = useState(false)
  const router = useRouter()

  async function saveBanner() {
    if (!banner.img1 && !banner.img2 && !banner.img3) {
      alert('Uploadez au moins une image')
      return
    }
    setBannerSaving(true)
    setBannerStatus('idle')
    try {
      const res = await fetch('/api/section/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ img1: banner.img1, img2: banner.img2, img3: banner.img3 }),
      })
      const data = await res.json()
      setBannerStatus(data.success ? 'success' : 'error')
    } catch {
      setBannerStatus('error')
    } finally {
      setBannerSaving(false)
    }
  }

  function generateBannerCode() { /* kept for compat */ }
  async function copyBannerCode() {
    await navigator.clipboard.writeText(bannerCode)
    setBannerCopied(true)
    setTimeout(() => setBannerCopied(false), 2000)
  }

  async function saveCartesFemme() {
    if (!cartesFemme.simple && !cartesFemme.coffret) {
      alert('Uploadez au moins une image')
      return
    }
    setCartesFemmeSaving(true)
    setCartesFemmeStatus('idle')
    try {
      const res = await fetch('/api/section/femme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simple: cartesFemme.simple, coffret: cartesFemme.coffret }),
      })
      const data = await res.json()
      if (data.success) {
        setCartesFemmeStatus('success')
      } else {
        setCartesFemmeStatus('error')
      }
    } catch {
      setCartesFemmeStatus('error')
    } finally {
      setCartesFemmeSaving(false)
    }
  }

  function generateCartesFemmeCode() { /* kept for compat */ }
  async function copyCartesFemmeCode() {
    await navigator.clipboard.writeText(cartesFemmeCode)
    setCartesFemmeCopied(true)
    setTimeout(() => setCartesFemmeCopied(false), 2000)
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

  function generateShowcaseCode() {
    if (!showcaseImg) { alert('Uploadez une photo'); return }
    const code = `Dans components/ShowcaseSection.tsx, remplacez la ligne SHOWCASE_IMG par :

export const SHOWCASE_IMG = '${showcaseImg}'`
    setShowcaseCode(code)
  }

  async function copyShowcaseCode() {
    await navigator.clipboard.writeText(showcaseCode)
    setShowcaseCopied(true)
    setTimeout(() => setShowcaseCopied(false), 2000)
  }

  async function saveHero() {
    if (!heroVideoUrl) { alert('Uploadez une vidéo'); return }
    setHeroSaving(true)
    setHeroStatus('idle')
    try {
      const res = await fetch('/api/section/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: heroVideoUrl }),
      })
      const data = await res.json()
      setHeroStatus(data.success ? 'success' : 'error')
    } catch {
      setHeroStatus('error')
    } finally {
      setHeroSaving(false)
    }
  }

  function generateVitrineCode() {
    if (!vitrineImg) { alert('Uploadez une photo'); return }
    const code = `Dans components/VitrineSection.tsx, remplacez la ligne VITRINE_IMG par :

export const VITRINE_IMG = '${vitrineImg}'`
    setVitrineCode(code)
  }

  async function copyVitrineCode() {
    await navigator.clipboard.writeText(vitrineCode)
    setVitrineCopied(true)
    setTimeout(() => setVitrineCopied(false), 2000)
  }

  function generateColorsCode() {
    if (!editProductId) { alert('Entrez l\'ID du produit'); return }
    const valid = editColors.filter((c) => c.name && c.img)
    if (valid.length === 0) { alert('Ajoutez au moins une couleur'); return }
    const code = `Dans data/products.ts, pour le produit id: ${editProductId}, remplacez (ou ajoutez) la propriété colors :

    colors: [
${valid.map((c) => `      { name: '${c.name}', img: '${c.img}' }`).join(',\n')},
    ],`
    setColorsCode(code)
  }

  async function copyColorsCode() {
    await navigator.clipboard.writeText(colorsCode)
    setColorsCopied(true)
    setTimeout(() => setColorsCopied(false), 2000)
  }

  function login() {
    if (password === ADMIN_PASSWORD) setAuth(true)
    else alert('Mot de passe incorrect')
  }

  function set(field: keyof ProductForm, value: string | boolean | number) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      // Auto-update SKU when cat or coffret changes (only if not manually set)
      if ((field === 'cat' || field === 'coffret') && !skuManual) {
        const cat = field === 'cat' ? (value as 'femme' | 'homme') : f.cat
        const coffret = field === 'coffret' ? (value as boolean) : f.coffret
        next.sku = computeSku(cat, coffret)
      }
      return next
    })
  }

  function loadProductForEdit(product: typeof products[0]) {
    setEditingProduct(product)
    setEditName(product.name.trim())
    setEditPrice(String(product.price))
    setEditOriginalPrice(String(product.originalPrice))
    setEditGridImg(product.gridImg)
    setEditDetailImg1(product.detailImgs?.[0] || '')
    setEditDetailImg2(product.detailImgs?.[1] || '')
    setEditCode('')
  }

  function buildEditBlock(): string {
    if (!editingProduct) return ''
    const p = editingProduct
    const name = editName || p.name
    const price = editPrice || String(p.price)
    const originalPrice = editOriginalPrice || String(p.originalPrice)
    const gridImg = editGridImg || p.gridImg
    const detailImgs = [editDetailImg1, editDetailImg2].filter(Boolean)
    const detailImgsCode = detailImgs.length > 0
      ? `\n${detailImgs.map((u) => `      '${u}'`).join(',\n')},`
      : ''
    const colorsCode = p.colors && p.colors.length > 0
      ? `\n    colors: [\n${p.colors.map((c: {name:string;img:string}) => `      { name: '${c.name}', img: '${c.img}' }`).join(',\n')},\n    ],`
      : ''
    return `  {
    id: ${p.id},
    sku: '${p.sku}',
    cat: '${p.cat}',
    name: '${name}',
    price: ${price},
    originalPrice: ${originalPrice},
    stock: ${p.stock},
    rating: ${p.rating},
    reviews: ${p.reviews},
    gridImg: '${gridImg}',
    detailImgs: [${detailImgsCode}
    ],${p.hot ? '\n    hot: true,' : ''}${p.coffret ? '\n    coffret: true,' : ''}${p.frame ? '\n    frame: true,' : ''}${p.imgScale && p.imgScale !== 1 ? `\n    imgScale: ${p.imgScale},` : ''}${p.imgPosition && p.imgPosition !== 'center' ? `\n    imgPosition: '${p.imgPosition}',` : ''}${colorsCode}
  },`
  }

  function generateEditCode() {
    if (!editingProduct) return
    setEditCode(buildEditBlock())
  }

  async function saveProduct() {
    if (!editingProduct) return
    setEditSaving(true)
    setEditSaveStatus('idle')
    setEditSaveMsg('')
    try {
      const newBlock = buildEditBlock()
      const res = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: editingProduct.id, newBlock }),
      })
      const data = await res.json()
      if (data.success) {
        setEditSaveStatus('success')
        setEditSaveMsg('✅ Sauvegardé ! Le site se met à jour dans ~1 minute.')
      } else {
        setEditSaveStatus('error')
        setEditSaveMsg(`❌ Erreur : ${data.error}`)
      }
    } catch {
      setEditSaveStatus('error')
      setEditSaveMsg('❌ Erreur réseau')
    } finally {
      setEditSaving(false)
    }
  }

  function resetEdit() {
    setEditingProduct(null)
    setEditName('')
    setEditPrice('')
    setEditOriginalPrice('')
    setEditGridImg('')
    setEditDetailImg1('')
    setEditDetailImg2('')
    setEditCode('')
  }

  async function copyEditCode() {
    await navigator.clipboard.writeText(editCode)
    setEditCopied(true)
    setTimeout(() => setEditCopied(false), 2000)
  }

  async function saveNewProduct() {
    if (!form.name || !form.price || !form.gridImg) {
      alert('Remplissez au minimum : nom, prix et image principale')
      return
    }
    const code = generateCode(form, nextId)
    setGeneratedCode(code)
    setAddSaving(true)
    setAddSaveStatus('idle')
    setAddSaveMsg('')
    try {
      const res = await fetch('/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newBlock: code }),
      })
      const data = await res.json()
      if (data.success) {
        setAddSaveStatus('success')
        setAddSaveMsg('✅ Produit sauvegardé ! Le site se met à jour dans ~1 minute.')
        setNextId((n) => n + 1)
      } else {
        setAddSaveStatus('error')
        setAddSaveMsg(`❌ Erreur : ${data.error}`)
      }
    } catch {
      setAddSaveStatus('error')
      setAddSaveMsg('❌ Erreur réseau')
    } finally {
      setAddSaving(false)
    }
  }

  async function generate() {
    if (!form.name || !form.price || !form.gridImg) {
      alert('Remplissez au minimum : nom, prix et image principale')
      return
    }
    const code = generateCode(form, nextId)
    setGeneratedCode(code)
    setNextId((n) => n + 1)

    // Envoi automatique au Google Sheet — onglet Catalogue
    try {
      const validColors = form.colors.filter((c) => c.name && c.img)
      await fetch('https://script.google.com/macros/s/AKfycbyzZ5VKvZfLes_Ld-7I9Cxjw3wwaBoZOzlxE6qZNF5_TwrWRN03xSQNHeUM2_A8PQRI/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'catalogue',
          sku: form.sku,
          name: form.name,
          cat: form.cat.toUpperCase(),
          packaging: form.coffret ? 'COFFRET' : 'SIMPLE',
          colors: validColors.map((c) => c.name).join(' / ') || '—',
          price: form.price,
          stock: form.stock,
        }),
      })
    } catch {
      // silencieux
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setSkuManual(false)
    setForm({ ...EMPTY, sku: computeSku('femme', false) })
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
            onClick={() => { setTab('edit'); resetEdit() }}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'edit'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            ✏️ Modifier un produit
          </button>
          <button
            onClick={() => setTab('hero')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'hero'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🏠 Photo Accueil
          </button>
          <button
            onClick={() => setTab('showcase')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'showcase'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🌟 Photo Showcase
          </button>
          <button
            onClick={() => setTab('banner')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'banner'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🖼️ 3 Photos Cercles
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
          <button
            onClick={() => setTab('cartesfemme')}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
              tab === 'cartesfemme'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            🎀 Cartes Femme
          </button>
        </div>

        {/* Hero / Accueil Tab */}
        {tab === 'hero' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Photo d&apos;Accueil
              </h2>
              <p className="text-gray-500 text-sm">Changez les photos du slider (1 ou 2 photos)</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 max-w-xl">
              <VideoUpload
                label="Vidéo d'accueil (MP4)"
                onUpload={(url) => setHeroVideoUrl(url)}
                currentUrl={heroVideoUrl}
              />
              <button
                onClick={saveHero}
                disabled={heroSaving}
                className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition disabled:opacity-50"
              >
                {heroSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
              {heroStatus === 'success' && (
                <p className="text-green-400 text-xs font-bold text-center">✅ Sauvegardé ! Le site se met à jour dans ~1 minute.</p>
              )}
              {heroStatus === 'error' && (
                <p className="text-red-400 text-xs font-bold text-center">❌ Erreur — réessayez</p>
              )}
            </div>
          </div>
        )}

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
                  onClick={saveBanner}
                  disabled={bannerSaving}
                  className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition disabled:opacity-50"
                >
                  {bannerSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                </button>
                {bannerStatus === 'success' && (
                  <p className="text-green-400 text-xs font-bold text-center">✅ Sauvegardé ! Le site se met à jour dans ~1 minute.</p>
                )}
                {bannerStatus === 'error' && (
                  <p className="text-red-400 text-xs font-bold text-center">❌ Erreur — réessayez</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cartes Femme Tab */}
        {tab === 'cartesfemme' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Photos des Cartes Femme
              </h2>
              <p className="text-gray-500 text-sm">
                Changez les photos des 2 cartes &quot;Boite Simple&quot; et &quot;Avec Coffret&quot; de la collection femme
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  📷 2 Photos des cartes femme
                </h3>
                <ImageUpload
                  label="Photo carte BOITE SIMPLE (gauche)"
                  onUpload={(url) => setCartesFemme((c) => ({ ...c, simple: url }))}
                  currentUrl={cartesFemme.simple}
                />
                <ImageUpload
                  label="Photo carte AVEC COFFRET (droite)"
                  onUpload={(url) => setCartesFemme((c) => ({ ...c, coffret: url }))}
                  currentUrl={cartesFemme.coffret}
                />
                <button
                  onClick={saveCartesFemme}
                  disabled={cartesFemmeSaving}
                  className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition disabled:opacity-50"
                >
                  {cartesFemmeSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                </button>
                {cartesFemmeStatus === 'success' && (
                  <p className="text-green-400 text-xs font-bold text-center">✅ Sauvegardé ! Le site se met à jour dans ~1 minute.</p>
                )}
                {cartesFemmeStatus === 'error' && (
                  <p className="text-red-400 text-xs font-bold text-center">❌ Erreur — réessayez</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {/* Aperçu */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                    👁️ Aperçu
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-500">Boite Simple</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cartesFemme.simple || 'https://res.cloudinary.com/dannr2e0c/image/upload/v1778590459/luxtim/azl6yitgbm54nxyrju6x.jpg'}
                        alt="simple femme"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-500">Avec Coffret</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cartesFemme.coffret || 'https://res.cloudinary.com/dannr2e0c/image/upload/v1778590463/luxtim/q2bhxqz0ll5wiilbrsy6.jpg'}
                        alt="coffret femme"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hidden">
                  <div className="p-5 min-h-[120px]">
                    <div className="flex items-center justify-center py-8 text-gray-600">
                      <p className="text-[11px] font-bold uppercase tracking-widest"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {tab === 'colors' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Modifier les Couleurs d&apos;un Produit
              </h2>
              <p className="text-gray-500 text-sm">
                Ajoutez ou modifiez les variantes de couleur d&apos;un produit existant
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-5">

                {/* Product ID */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                    🔢 ID du produit
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Entrez l&apos;ID du produit à modifier
                    </label>
                    <input
                      type="number"
                      value={editProductId}
                      onChange={(e) => setEditProductId(e.target.value)}
                      placeholder="ex: 106"
                      className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-3 text-lg font-black outline-none transition text-white"
                    />
                    <p className="text-gray-600 text-[10px]">
                      IDs actuels — ROLEX: 106 · CASIO: 105 · CARTIER: 102/103 · GUESS: 100
                    </p>
                  </div>
                </div>

                {/* Colors list */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                      🎨 Couleurs
                    </h3>
                    <button
                      onClick={() => setEditColors((c) => [...c, { name: '', img: '' }])}
                      className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/40 px-3 py-1.5 rounded-lg hover:bg-[#C5A059]/10 transition"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {editColors.length === 0 && (
                    <p className="text-gray-600 text-[10px] text-center py-4">
                      Cliquez sur &quot;+ Ajouter&quot; pour ajouter des couleurs
                    </p>
                  )}

                  {editColors.map((c, i) => (
                    <div key={i} className="flex flex-col gap-3 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-gray-400">Couleur {i + 1}</span>
                        <button
                          onClick={() => setEditColors((arr) => arr.filter((_, j) => j !== i))}
                          className="text-red-400 text-[10px] font-black hover:text-red-300"
                        >
                          ✕ Supprimer
                        </button>
                      </div>
                      <input
                        value={c.name}
                        onChange={(e) => setEditColors((arr) =>
                          arr.map((col, j) => j === i ? { ...col, name: e.target.value } : col)
                        )}
                        placeholder="ex: TABLEAU NOIR"
                        className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition uppercase"
                      />
                      <ImageUpload
                        label={`Photo pour "${c.name || `Couleur ${i + 1}`}"`}
                        onUpload={(url) => setEditColors((arr) =>
                          arr.map((col, j) => j === i ? { ...col, img: url } : col)
                        )}
                        currentUrl={c.img}
                      />
                    </div>
                  ))}

                  {editColors.length > 0 && (
                    <button
                      onClick={generateColorsCode}
                      className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition"
                    >
                      ⚡ Générer le code
                    </button>
                  )}
                </div>
              </div>

              {/* Right: instructions + code */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                    📋 Comment utiliser
                  </h3>
                  <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                    <li>Entrez l&apos;ID du produit (ex: 106 pour ROLEX)</li>
                    <li>Cliquez sur <strong className="text-white">+ Ajouter</strong> pour chaque couleur</li>
                    <li>Écrivez le nom + uploadez la photo</li>
                    <li>Cliquez sur <strong className="text-white">Générer le code</strong></li>
                    <li>Copiez et collez dans Antigravity</li>
                  </ol>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Code généré
                    </span>
                    {colorsCode && (
                      <button
                        onClick={copyColorsCode}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${
                          colorsCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'
                        }`}
                      >
                        {colorsCopied ? '✓ Copié !' : 'Copier'}
                      </button>
                    )}
                  </div>
                  <div className="p-5 min-h-[200px]">
                    {colorsCode ? (
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {colorsCode}
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

        {/* Showcase Tab */}
        {tab === 'showcase' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Photo Showcase
              </h2>
              <p className="text-gray-500 text-sm">
                La grande photo pleine largeur en haut de la page d&apos;accueil
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  📷 Photo pleine largeur
                </h3>
                <ImageUpload
                  label="Photo showcase (pleine largeur)"
                  onUpload={(url) => setShowcaseImg(url)}
                  currentUrl={showcaseImg}
                />
                {showcaseImg && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Aperçu</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={showcaseImg} alt="aperçu" className="w-full rounded-xl object-cover" style={{ maxHeight: '200px' }} />
                  </div>
                )}
                <button
                  onClick={generateShowcaseCode}
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
                    <li>Uploadez votre photo</li>
                    <li>Cliquez sur <strong className="text-white">Générer le code</strong></li>
                    <li>Copiez et collez dans Antigravity</li>
                    <li>Antigravity met à jour et déploie</li>
                  </ol>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Code généré</span>
                    {showcaseCode && (
                      <button
                        onClick={copyShowcaseCode}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${showcaseCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'}`}
                      >
                        {showcaseCopied ? '✓ Copié !' : 'Copier'}
                      </button>
                    )}
                  </div>
                  <div className="p-5 min-h-[150px]">
                    {showcaseCode ? (
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">{showcaseCode}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-600 py-10">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-center">Le code apparaîtra ici</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vitrine Tab */}
        {tab === 'vitrine' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Cadre Vitrine
              </h2>
              <p className="text-gray-500 text-sm">
                Changez la grande photo vitrine qui apparaît en bas de la page d&apos;accueil
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  📷 Photo Vitrine
                </h3>
                <ImageUpload
                  label="Photo du cadre vitrine"
                  onUpload={(url) => setVitrineImg(url)}
                  currentUrl={vitrineImg}
                />
                {vitrineImg && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Aperçu</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vitrineImg}
                      alt="aperçu vitrine"
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                <button
                  onClick={generateVitrineCode}
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
                    <li>Uploadez votre nouvelle photo vitrine</li>
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
                    {vitrineCode && (
                      <button
                        onClick={copyVitrineCode}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${
                          vitrineCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'
                        }`}
                      >
                        {vitrineCopied ? '✓ Copié !' : 'Copier'}
                      </button>
                    )}
                  </div>
                  <div className="p-5 min-h-[150px]">
                    {vitrineCode ? (
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                        {vitrineCode}
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

        {/* ── Edit Product Tab ─────────────────────────────── */}
        {tab === 'edit' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-white mb-2">
                Modifier un produit
              </h2>
              <p className="text-gray-500 text-sm">
                Sélectionnez un produit pour modifier son nom, prix ou photos
              </p>
            </div>

            {!editingProduct ? (
              /* ── Product list ── */
              <div className="flex flex-col gap-4">
                {/* Search */}
                <input
                  value={editSearch}
                  onChange={(e) => setEditSearch(e.target.value)}
                  placeholder="🔍 Rechercher un produit..."
                  className="bg-white/5 border border-white/10 focus:border-[#C5A059] rounded-xl px-5 py-3 text-sm outline-none transition text-white placeholder-gray-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products
                    .filter((p) =>
                      editSearch === '' ||
                      p.name.toLowerCase().includes(editSearch.toLowerCase()) ||
                      p.sku.toLowerCase().includes(editSearch.toLowerCase())
                    )
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => loadProductForEdit(p)}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-4 text-left transition group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.gridImg}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] mb-0.5">
                            {p.sku}
                          </p>
                          <p className="text-xs font-black uppercase text-white leading-snug line-clamp-2 mb-1">
                            {p.name.trim()}
                          </p>
                          <p className="text-[10px] font-black text-gray-400">
                            {p.price} MAD
                          </p>
                        </div>
                        <span className="text-[#C5A059] text-lg group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              /* ── Edit form ── */
              <div className="flex flex-col gap-6">
                {/* Back button + product info */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={resetEdit}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition"
                  >
                    ← Retour à la liste
                  </button>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">
                      {editingProduct.sku}
                    </p>
                    <p className="text-xs font-black uppercase text-white">
                      {editingProduct.name.trim()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: form */}
                  <div className="flex flex-col gap-5">

                    {/* Nom */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                        📝 Nom du produit
                      </h3>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-3 text-sm outline-none transition text-white"
                        placeholder={editingProduct.name.trim()}
                      />
                    </div>

                    {/* Prix */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                        💰 Prix
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Prix de vente (MAD)
                          </label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition text-white"
                            placeholder={String(editingProduct.price)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Prix barré (MAD)
                          </label>
                          <input
                            type="number"
                            value={editOriginalPrice}
                            onChange={(e) => setEditOriginalPrice(e.target.value)}
                            className="bg-black/50 border border-white/10 focus:border-[#C5A059] rounded-lg px-4 py-2.5 text-sm outline-none transition text-white"
                            placeholder={String(editingProduct.originalPrice)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                        📷 Photos
                      </h3>
                      <ImageUpload
                        label="Photo principale (grille)"
                        onUpload={(url) => setEditGridImg(url)}
                        currentUrl={editGridImg}
                      />
                      <ImageUpload
                        label="Photo détail 1"
                        onUpload={(url) => setEditDetailImg1(url)}
                        currentUrl={editDetailImg1}
                      />
                      <ImageUpload
                        label="Photo détail 2 (optionnel)"
                        onUpload={(url) => setEditDetailImg2(url)}
                        currentUrl={editDetailImg2}
                      />
                    </div>

                    {/* Save status */}
                    {editSaveStatus !== 'idle' && (
                      <div className={`rounded-xl px-5 py-4 text-sm font-black ${
                        editSaveStatus === 'success'
                          ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                          : 'bg-red-500/20 border border-red-500/40 text-red-400'
                      }`}>
                        {editSaveMsg}
                      </div>
                    )}

                    {/* Save button */}
                    <button
                      onClick={saveProduct}
                      disabled={editSaving}
                      className="w-full py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition shadow-lg disabled:opacity-50 disabled:cursor-wait"
                    >
                      {editSaving ? '⏳ Sauvegarde en cours...' : '💾 Sauvegarder sur le site'}
                    </button>
                  </div>

                  {/* Right: preview + code */}
                  <div className="flex flex-col gap-5">
                    {/* Current vs new preview */}
                    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        👁️ Aperçu
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-black uppercase text-gray-400">AVANT</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingProduct.gridImg}
                            alt="avant"
                            className="w-full aspect-square object-cover rounded-xl opacity-60"
                          />
                          <p className="text-[9px] font-black uppercase text-gray-500 line-clamp-1">
                            {editingProduct.name.trim()}
                          </p>
                          <p className="text-[10px] font-black text-gray-500">
                            {editingProduct.price} MAD
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-black uppercase text-[#C5A059]">APRÈS</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editGridImg || editingProduct.gridImg}
                            alt="après"
                            className="w-full aspect-square object-cover rounded-xl"
                          />
                          <p className="text-[9px] font-black uppercase text-black line-clamp-1">
                            {editName || editingProduct.name.trim()}
                          </p>
                          <p className="text-[10px] font-black text-black">
                            {editPrice || editingProduct.price} MAD
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                        📋 Comment utiliser
                      </h3>
                      <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                        <li>Modifiez le nom, le prix ou uploadez de nouvelles photos</li>
                        <li>Cliquez sur <strong className="text-white">💾 Sauvegarder sur le site</strong></li>
                        <li>Le site se met à jour automatiquement en ~1 minute ✅</li>
                      </ol>
                    </div>

                    {/* Generated code */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Code généré
                        </span>
                        {editCode && (
                          <button
                            onClick={copyEditCode}
                            className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition ${
                              editCopied ? 'bg-green-500 text-white' : 'bg-[#C5A059] text-black'
                            }`}
                          >
                            {editCopied ? '✓ Copié !' : 'Copier'}
                          </button>
                        )}
                      </div>
                      <div className="p-5 min-h-[200px]">
                        {editCode ? (
                          <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[400px]">
                            {editCode}
                          </pre>
                        ) : (
                          <div className="flex items-center justify-center py-10 text-gray-600">
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
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Référence (SKU)
                  </label>
                  {skuManual && (
                    <button
                      onClick={() => { setSkuManual(false); set('sku', computeSku(form.cat, form.coffret)) }}
                      className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] hover:underline"
                    >
                      ↺ Auto
                    </button>
                  )}
                </div>
                <input
                  value={form.sku}
                  onChange={(e) => { setSkuManual(true); set('sku', e.target.value) }}
                  className={`bg-black/50 border rounded-lg px-4 py-2.5 text-sm outline-none transition font-mono ${
                    skuManual ? 'border-[#C5A059]/60 text-[#C5A059]' : 'border-white/10 text-green-400'
                  }`}
                  placeholder="GSH-F-BS-01"
                />
                <p className="text-[9px] text-gray-600 font-semibold">
                  {skuManual ? '✎ Modifié manuellement' : '⚡ Généré automatiquement selon catégorie'}
                </p>
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

                {/* Frame toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Cadre Photo
                  </label>
                  <button
                    onClick={() => set('frame', !form.frame)}
                    className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition
                      ${form.frame
                        ? 'bg-[#C5A059] text-black'
                        : 'bg-black/50 border border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                  >
                    {form.frame ? '🖼️ Cadre activé' : 'Activer Cadre'}
                  </button>
                  {form.frame && (
                    <p className="text-[9px] text-[#C5A059]/70 font-semibold">
                      ✓ La photo s&apos;affichera avec un cadre doré
                    </p>
                  )}
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
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={saveNewProduct}
                  disabled={addSaving}
                  className="flex-1 py-4 bg-[#C5A059] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:bg-[#d4b572] transition shadow-lg disabled:opacity-50 disabled:cursor-wait"
                >
                  {addSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder sur le site'}
                </button>
                <button
                  onClick={generate}
                  className="px-5 py-4 border border-white/10 text-gray-400 font-black uppercase text-[11px] tracking-widest rounded-xl hover:border-white/30 hover:text-white transition"
                >
                  Code
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-4 border border-white/10 text-gray-400 font-black uppercase text-[11px] tracking-widest rounded-xl hover:border-white/30 hover:text-white transition"
                >
                  Reset
                </button>
              </div>
              {addSaveStatus !== 'idle' && (
                <div className={`rounded-xl px-5 py-4 text-sm font-black ${
                  addSaveStatus === 'success'
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-red-500/20 border border-red-500/40 text-red-400'
                }`}>
                  {addSaveMsg}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Preview + Code ── */}
          <div className="flex flex-col gap-6">

            {/* ── LIVE PREVIEW ── */}
            <div className="bg-white rounded-2xl p-5 flex flex-col gap-3" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                👁️ Aperçu — comme sur le site
              </p>

              {form.gridImg ? (
                <div className="flex flex-col gap-4">
                  {/* Card preview */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Vue grille</p>
                    <div className="w-40 cursor-pointer group">
                      {/* Image */}
                      <div
                        className="relative w-full aspect-square overflow-hidden mb-2"
                        style={{
                          borderRadius: '6px',
                          ...(form.frame ? {
                            border: '3px solid #C5A059',
                            boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 1px #C5A059, 0 4px 18px rgba(197,160,89,0.25)',
                            padding: '4px',
                            background: '#fff',
                          } : {}),
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.gridImg}
                          alt="aperçu"
                          className="w-full h-full object-cover"
                          style={{
                            borderRadius: '3px',
                            objectPosition: form.imgPosition,
                            transform: `scale(${form.imgScale})`,
                            transformOrigin: form.imgPosition,
                          }}
                        />
                      </div>
                      {/* Text */}
                      <div className="px-0.5">
                        <h3 className="text-[10px] font-black uppercase text-black leading-snug mb-1">
                          {form.name || 'NOM DU PRODUIT'}
                        </h3>
                        <p className="text-black font-black text-xs tracking-wide">
                          {form.price || '000'}.00 <span className="text-[10px] text-gray-500 font-semibold">MAD</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Zoom + Position controls ── */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                      🔍 Ajuster le cadrage
                    </p>

                    {/* Zoom buttons */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-400">Zoom</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => set('imgScale', Math.max(1, parseFloat((form.imgScale - 0.1).toFixed(1))))}
                          className="flex-1 py-3 bg-gray-100 text-black text-xl font-black rounded-xl hover:bg-gray-200 transition"
                        >
                          −
                        </button>
                        <span className="text-base font-black text-black w-12 text-center">
                          {form.imgScale.toFixed(1)}×
                        </span>
                        <button
                          onClick={() => set('imgScale', Math.min(2, parseFloat((form.imgScale + 0.1).toFixed(1))))}
                          className="flex-1 py-3 bg-[#C5A059] text-black text-xl font-black rounded-xl hover:bg-[#d4b572] transition"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold px-1">
                        <span>1.0× = normal</span><span>2.0× = zoom max</span>
                      </div>
                    </div>

                    {/* Position grid */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-gray-400">Position</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { label: '↖', val: 'top left' },
                          { label: '↑', val: 'top' },
                          { label: '↗', val: 'top right' },
                          { label: '←', val: 'left' },
                          { label: '⊙', val: 'center' },
                          { label: '→', val: 'right' },
                          { label: '↙', val: 'bottom left' },
                          { label: '↓', val: 'bottom' },
                          { label: '↘', val: 'bottom right' },
                        ].map(({ label, val }) => (
                          <button
                            key={val}
                            onClick={() => set('imgPosition', val)}
                            className={`py-2 rounded-lg text-sm font-black transition border ${
                              form.imgPosition === val
                                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detail preview */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Vue page produit</p>
                    <div
                      className="relative w-full aspect-square overflow-hidden"
                      style={{
                        ...(form.frame ? {
                          border: '4px solid #C5A059',
                          boxShadow: 'inset 0 0 0 3px #fff, inset 0 0 0 4px #C5A059, 0 8px 32px rgba(197,160,89,0.3)',
                          borderRadius: '10px',
                          padding: '6px',
                          background: '#fff',
                        } : {
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }),
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.gridImg}
                        alt="aperçu detail"
                        className="w-full h-full object-cover"
                        style={{
                          borderRadius: form.frame ? '6px' : '10px',
                          objectPosition: form.imgPosition,
                          transform: `scale(${form.imgScale})`,
                          transformOrigin: form.imgPosition,
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] font-black uppercase text-black leading-snug">
                        {form.name || 'NOM DU PRODUIT'}
                      </p>
                      <p className="text-black font-black text-sm mt-1">
                        {form.price || '000'}.00 <span className="text-xs text-gray-500 font-semibold">MAD</span>
                        {form.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">{form.originalPrice}.00</span>
                        )}
                      </p>
                      {form.coffret && (
                        <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full">
                          Avec Coffret
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                  <div className="text-4xl mb-3">📷</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-center">
                    Uploadez une photo<br />pour voir l&apos;aperçu
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] mb-3">
                📋 Comment utiliser
              </h3>
              <ol className="text-gray-400 text-xs flex flex-col gap-2 list-decimal list-inside">
                <li>Uploadez les images depuis votre ordinateur</li>
                <li>Remplissez les informations du produit</li>
                <li>Cliquez sur <strong className="text-white">💾 Sauvegarder sur le site</strong></li>
                <li>Le produit apparaît sur le site en ~1 minute ✅</li>
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
