'use client'

import { useStore } from '@/context/StoreContext'

export default function CartDrawer() {
  const { cart, cartTotal, isCartOpen, toggleCart, removeFromCart, openCheckout } = useStore()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[2999] backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-[90%] max-w-[400px] h-screen bg-white z-[3000] shadow-2xl transition-transform duration-[400ms] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-black uppercase text-sm tracking-widest text-black">Mon Panier</h2>
            <button
              onClick={toggleCart}
              className="text-gray-400 hover:text-black text-2xl transition"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                <i className="fa-solid fa-basket-shopping text-4xl mb-3" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Panier vide</p>
              </div>
            ) : (
              cart.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white p-3 rounded-lg shadow-sm items-center border border-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.gridImg}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-[10px] font-black uppercase text-gray-800 truncate">
                      {item.name}
                    </h4>
                    <p className="text-black text-[11px] font-bold mt-1">
                      {item.price} Dh{' '}
                      <span className="text-gray-400 font-normal">x{item.qty}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center flex-shrink-0"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between font-black mb-6 items-center">
              <span className="text-gray-500 text-[10px] uppercase tracking-widest">SOUS-TOTAL</span>
              <span className="text-2xl text-black font-serif">{cartTotal.toFixed(2)} MAD</span>
            </div>
            <button
              onClick={() => openCheckout('cart')}
              disabled={cart.length === 0}
              className="w-full text-white py-4 font-black uppercase text-[11px] tracking-widest rounded-lg flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C5A059 0%, #d4b572 100%)' }}
            >
              <span>VALIDER LA COMMANDE</span>
              <span className="font-arabic text-[13px] font-bold">إتمام الطلب</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
