'use client'

import { useState } from 'react'
import { ShoppingCart, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types/database'
import { useCartStore } from '@/store/useCart'

interface ProductActionsProps {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const isOutOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="bg-[#0c0514] border border-border-violet p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-32">
          <label htmlFor="quantity" className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
            Cantidad
          </label>
          <select 
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={isOutOfStock}
            className="w-full bg-[#12071f] border border-border-violet text-foreground p-3 rounded-none focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet disabled:opacity-50"
          >
            {isOutOfStock ? (
              <option value="0">0</option>
            ) : (
              [...Array(Math.min(product.stock, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))
            )}
          </select>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-2 border p-3 uppercase tracking-widest text-sm font-semibold transition-all duration-300 ${
            added
              ? 'bg-green-600 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              : 'bg-accent-violet hover:bg-[#a855f7] disabled:bg-gray-800 disabled:text-gray-500 disabled:border-transparent text-white border-transparent shadow-glow hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]'
          }`}
        >
          {added ? (
            <>
              <Check size={18} /> ¡Añadido al Carrito!
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
            </>
          )}
        </button>
      </div>

      {added && (
        <div className="mt-4 pt-3 border-t border-border-violet/40 flex items-center justify-between">
          <span className="text-xs text-zinc-300">¿Listo para ordenar?</span>
          <Link href="/carrito" className="text-xs uppercase tracking-wider text-accent-violet hover:underline flex items-center gap-1 font-semibold">
            Ir al Carrito <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center text-xs text-secondary">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`}></span>
        {isOutOfStock ? "Fuera de stock por el momento" : `Stock disponible: Quedan ${product.stock} unidades`}
      </div>
    </div>
  )
}
