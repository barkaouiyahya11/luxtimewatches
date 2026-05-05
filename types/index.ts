export interface Product {
  id: number
  sku: string
  cat: 'femme' | 'homme'
  name: string
  price: number
  originalPrice: number
  stock: number
  rating: number
  reviews: number
  gridImg: string
  detailImgs: string[]
  hot?: boolean
  coffret?: boolean
  colors?: { name: string; img: string }[]
  frame?: boolean
  imgScale?: number
  imgPosition?: string
}

export interface CartItem extends Product {
  qty: number
  selectedColor?: string  // nom de la couleur choisie par le client
}

export interface Review {
  name: string
  city: string
  rating: number
  text: string
  email: string
}
