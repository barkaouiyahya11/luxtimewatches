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
}

export interface CartItem extends Product {
  qty: number
}

export interface Review {
  name: string
  city: string
  rating: number
  text: string
  email: string
}
