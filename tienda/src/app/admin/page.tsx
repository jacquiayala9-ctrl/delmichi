import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Obtener la sesión actual
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Verificar rol en la tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile as any).role !== 'admin') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-20">
        <h1 className="text-2xl text-red-500 mb-4">Acceso Denegado</h1>
        <p className="text-zinc-400">No tienes permisos de administrador para ver esta página.</p>
        <a href="/" className="mt-4 text-accent-violet hover:underline">Volver al inicio</a>
      </div>
    )
  }

  // 3. Obtener productos para pasarlos al componente de cliente
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-accent-violet/90">Panel de Administración</h1>
          <p className="text-sm text-zinc-400">Gestiona tu catálogo, precios y stock.</p>
        </div>
      </div>
      
      <AdminDashboard initialProducts={products || []} />
    </div>
  )
}
