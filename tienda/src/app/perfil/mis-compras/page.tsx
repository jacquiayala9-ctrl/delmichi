import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingBag, Clock, CheckCircle2, Truck } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { Order } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function MisComprasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?message=Debes iniciar sesión para consultar tus compras.')
  }

  // Obtener perfil para verificar si es administrador
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Obtener órdenes asociadas al correo del usuario
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('cliente_email', user.email || '')
    .order('created_at', { ascending: false })

  const ordersList = (orders || []) as Order[]

  const getStatusBadge = (estado: string | null) => {
    switch (estado?.toLowerCase()) {
      case 'pagado':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
            <CheckCircle2 size={13} /> Pagado
          </span>
        )
      case 'enviado':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 rounded">
            <Truck size={13} /> Enviado
          </span>
        )
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded">
            <CheckCircle2 size={13} /> Entregado
          </span>
        )
      case 'pendiente':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded">
            <Clock size={13} /> Pendiente
          </span>
        )
    }
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 mb-24">
      {/* Header del Perfil */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-zinc-800 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-violet font-semibold">Mi Cuenta</span>
          <h1 className="text-3xl font-heading text-foreground mt-1">Historial de Compras</h1>
          <p className="text-sm text-zinc-400 mt-1">Sesión activa como: <span className="text-zinc-200">{user.email}</span></p>
        </div>

        <div className="flex items-center gap-3">
          {(profile as any)?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-xs uppercase tracking-widest bg-accent-violet hover:bg-[#a855f7] text-white px-4 py-2 font-medium transition-colors shadow-glow"
            >
              Panel Admin
            </Link>
          )}

          <form action={logout}>
            <button 
              type="submit" 
              className="text-xs uppercase tracking-widest border border-zinc-800 hover:border-red-500/50 hover:text-red-400 text-zinc-400 px-4 py-2 transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Órdenes */}
      {ordersList.length === 0 ? (
        <div className="text-center py-20 border border-border-violet/30 bg-[#12071f]/20 rounded-sm">
          <Package className="mx-auto text-accent-violet/60 mb-4" size={48} />
          <h2 className="text-xl font-heading text-foreground mb-2">Aún no has forjado ninguna compra</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8">
            Tus pedidos confirmados y su estado de envío aparecerán detallados aquí.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-accent-violet hover:bg-white hover:text-black text-white px-6 py-3 uppercase tracking-widest text-xs font-semibold transition-all duration-300 shadow-glow"
          >
            <ShoppingBag size={16} /> Explorar Joyería
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersList.map((order) => {
            const items = (Array.isArray(order.items) ? order.items : []) as any[]
            const fecha = new Date(order.created_at).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            return (
              <div 
                key={order.id} 
                className="border border-zinc-800 bg-[#0c0514] p-6 rounded-sm hover:border-accent-violet/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-zinc-800/60">
                  <div>
                    <span className="text-xs font-mono text-zinc-500 block">Orden #{order.id.slice(0, 8)}</span>
                    <span className="text-xs text-zinc-400">Fecha: {fecha}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.estado)}
                    <span className="font-heading text-lg text-accent-violet font-semibold">
                      ${Number(order.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                {items.length > 0 && (
                  <div className="mt-4 pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-3 font-semibold">Artículos:</h4>
                    <div className="divide-y divide-zinc-800/40">
                      {items.map((item, idx) => (
                        <div key={idx} className="py-2 flex justify-between items-center text-sm">
                          <span className="text-zinc-200">
                            {item.quantity || 1}x {item.nombre || item.name || 'Joya Delmichi'}
                          </span>
                          <span className="text-zinc-400 font-mono text-xs">
                            ${Number(item.precio || item.price || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
