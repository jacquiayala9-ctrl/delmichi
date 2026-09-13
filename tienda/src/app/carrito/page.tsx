'use client'
export const runtime = 'edge';

import { useState } from 'react'
import { useCartStore } from '@/store/useCart'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [email, setEmail] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    const orderData = {
      user_id: user ? user.id : null,
      cliente_email: user ? user.email : (email || 'invitado@example.com'),
      total: totalPrice,
      estado: 'Pendiente',
      items: items,
      direccion_envio: {}
    }

    const { error } = await supabase.from('orders').insert([orderData])
    
    if (error) {
      alert('Hubo un error procesando tu pedido.')
    } else {
      alert('¡Pedido realizado con éxito!')
      clearCart()
      if (user) {
        router.push('/perfil')
      } else {
        router.push('/')
      }
    }
    setIsCheckingOut(false)
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-20">
        <h1 className="text-3xl font-serif text-accent-violet/90 mb-4">Tu Carrito está vacío</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-md">Parece que aún no has encontrado esa pieza especial para tu colección.</p>
        <Link 
          href="/productos" 
          className="bg-accent-violet hover:bg-[#a855f7] text-white font-medium px-8 py-3 uppercase tracking-widest text-sm transition-all duration-300 shadow-glow"
        >
          Explorar Joyas
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
      <h1 className="text-3xl font-serif text-accent-violet/90 mb-8">Carrito de Compras</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-zinc-800 bg-black/40 rounded-sm">
              <div className="w-24 h-24 flex-shrink-0 bg-zinc-900 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">Sin Imagen</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-zinc-200">{item.nombre}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{item.categoria}</p>
                  </div>
                  <p className="font-medium text-foreground">
                    ${(item.precio * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3 border border-zinc-700 rounded-sm px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-zinc-400 hover:text-white disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-sm text-zinc-500 hover:text-white self-start mt-2"
          >
            Vaciar Carrito
          </button>
        </div>

        <div className="w-full lg:w-80 h-fit bg-[#0c0514] border border-border-violet p-6">
          <h2 className="text-xl font-serif text-accent-violet mb-6">Resumen de Compra</h2>
          
          <div className="flex justify-between items-center mb-4 text-zinc-300">
            <span>Subtotal</span>
            <span>${totalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-zinc-300">
            <span>Envío</span>
            <span className="text-sm text-zinc-500">A coordinar</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mb-6">
            <span className="font-medium text-lg">Total</span>
            <span className="font-bold text-lg text-accent-violet">
              ${totalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs text-zinc-400 mb-1">Email de contacto (si no tienes cuenta)</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" 
            />
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-accent-violet hover:bg-white hover:text-black text-white font-medium py-3 tracking-widest text-sm uppercase transition-colors duration-300 disabled:opacity-50"
          >
            {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  )
}


