'use client'
export const runtime = 'edge';

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product, Order } from '@/types/database'
import ChangePasswordModal from '@/components/ChangePasswordModal'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch favorites
      const { data: favData } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)

      if (favData && favData.length > 0) {
        const productIds = favData.map(f => f.product_id)
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
        if (productsData) setFavorites(productsData)
      }

      // Fetch orders
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (orderData) setOrders(orderData)

      setLoading(false)
    }
    fetchProfile()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500">Cargando perfil...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-heading text-accent-violet">Mi Perfil</h1>
          <p className="text-zinc-400 mt-1">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChangingPassword(true)}
            className="px-4 py-2 bg-[#0a0512] border border-zinc-800 text-zinc-300 hover:text-white hover:border-accent-violet rounded transition-all text-sm"
          >
            Cambiar Contraseña
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-red-500/10 rounded transition-all text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Favoritos */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-heading mb-6 border-b border-zinc-800 pb-2">Mis Favoritos</h2>
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-black/30 border border-zinc-800/50 rounded">
              <p className="text-zinc-500 mb-4">No tienes productos favoritos aún.</p>
              <Link href="/productos" className="text-accent-violet hover:underline">Explorar productos</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favorites.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.nombre}
                  price={product.precio}
                  category={product.categoria || ''}
                  imageUrl={product.image_url || ''}
                />
              ))}
            </div>
          )}
        </div>

        {/* Órdenes */}
        <div>
          <h2 className="text-xl font-heading mb-6 border-b border-zinc-800 pb-2">Mis Pedidos</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-black/30 border border-zinc-800/50 rounded">
              <p className="text-zinc-500">Aún no has hecho ningún pedido.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-[#0a0512] border border-zinc-800 rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-accent-violet/20 text-accent-violet rounded uppercase tracking-wider">
                      {order.estado || 'Recibido'}
                    </span>
                  </div>
                  <p className="font-medium">Total: ${order.total}</p>
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-1">
                    ID: {order.id.split('-')[0]}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isChangingPassword} 
        onClose={() => setIsChangingPassword(false)} 
        userEmail={user?.email || ''}
      />
    </div>
  )
}


