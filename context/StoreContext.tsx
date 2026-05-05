'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, Product } from '@/types'

interface CheckoutState {
  isOpen: boolean
  mode: 'direct' | 'cart'
  directProduct?: Product
  directQty?: number
  directColor?: string
}

interface LightboxState {
  isOpen: boolean
  src: string
}

interface ToastState {
  message: string
  visible: boolean
}

interface StoreContextType {
  // Cart items
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, qty: number, selectedColor?: string) => void
  removeFromCart: (index: number) => void
  clearCart: () => void

  // Cart drawer
  isCartOpen: boolean
  toggleCart: () => void
  closeCart: () => void

  // Checkout modal
  checkout: CheckoutState
  openCheckout: (mode: 'direct' | 'cart', product?: Product, qty?: number, selectedColor?: string) => void
  closeCheckout: () => void

  // Review modal
  isReviewOpen: boolean
  openReview: () => void
  closeReview: () => void

  // Lightbox
  lightbox: LightboxState
  openLightbox: (src: string) => void
  closeLightbox: () => void

  // Toast
  toast: ToastState
  showToast: (msg: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkout, setCheckout] = useState<CheckoutState>({ isOpen: false, mode: 'cart' })
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false, src: '' })
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })

  const addToCart = useCallback((product: Product, qty: number, selectedColor?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty, selectedColor }]
    })
  }, [])

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleCart = useCallback(() => setIsCartOpen(p => !p), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const openCheckout = useCallback((mode: 'direct' | 'cart', product?: Product, qty?: number, selectedColor?: string) => {
    setCheckout({ isOpen: true, mode, directProduct: product, directQty: qty, directColor: selectedColor })
    if (mode === 'cart') setIsCartOpen(false)
  }, [])

  const closeCheckout = useCallback(() => setCheckout(p => ({ ...p, isOpen: false })), [])

  const openReview = useCallback(() => setIsReviewOpen(true), [])
  const closeReview = useCallback(() => setIsReviewOpen(false), [])

  const openLightbox = useCallback((src: string) => setLightbox({ isOpen: true, src }), [])
  const closeLightbox = useCallback(() => setLightbox(p => ({ ...p, isOpen: false })), [])

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, visible: true })
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000)
  }, [])

  const cartCount = cart.length
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <StoreContext.Provider value={{
      cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart,
      isCartOpen, toggleCart, closeCart,
      checkout, openCheckout, closeCheckout,
      isReviewOpen, openReview, closeReview,
      lightbox, openLightbox, closeLightbox,
      toast, showToast,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
