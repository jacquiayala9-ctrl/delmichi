'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { Trash2, Edit, Plus, X, Save, Image as ImageIcon, Upload, Star } from 'lucide-react'

type MediaItem = {
  name: string
  url: string
  path: string
}

type Category = {
  id: string
  nombre: string
  slug: string
}

type StoreSettings = {
  whatsapp: string
  instagram: string
  email: string
}

import { deleteOrdersAction, addHeroImageAction, deleteHeroImageAction } from './actions'

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isEditing, setIsEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'gallery' | 'media' | 'categories' | 'settings' | 'ventas'>('products')
  
  // Gallery state
  const [gallery, setGallery] = useState<{id: string, image_url: string, active: boolean}[]>([])
  const [isAddingImage, setIsAddingImage] = useState(false)
  
  // Ventas state
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>({ whatsapp: '', instagram: '', email: '' })
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  // Orders state
  const [orders, setOrders] = useState<any[]>([])

  // Modals state
  const [isSelectingImage, setIsSelectingImage] = useState<{onSelect: (url: string) => void} | null>(null)
  const [isViewingImage, setIsViewingImage] = useState<string | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState<string>('')
  const [tempDestacado, setTempDestacado] = useState<boolean>(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (activeTab === 'media') loadMedia()
    else if (activeTab === 'gallery') loadGallery()
    else if (activeTab === 'categories') loadCategories()
    else if (activeTab === 'settings') loadSettings()
    else if (activeTab === 'ventas') loadOrders()
  }, [activeTab])

  // Pre-load categories for the product modal if we are on products tab
  useEffect(() => {
    if (activeTab === 'products') loadCategories()
  }, [activeTab])

  // ================= FETCH DATA =================
  const loadMedia = async () => {
    const folders = ['products', 'slider', 'uploads']
    let allMedia: MediaItem[] = []
    for (const folder of folders) {
      const { data } = await supabase.storage.from('products-images').list(folder, {
        limit: 100, sortBy: { column: 'created_at', order: 'desc' },
      })
      if (data) {
        const files = data.filter(f => f.id).map(f => {
          const path = `${folder}/${f.name}`
          const { data: publicUrlData } = supabase.storage.from('products-images').getPublicUrl(path)
          return { name: f.name, path: path, url: publicUrlData.publicUrl }
        })
        allMedia = [...allMedia, ...files]
      }
    }
    allMedia.reverse()
    setMediaList(allMedia)
  }

  const loadGallery = async () => {
    const { data } = await supabase.from('hero_gallery').select('*').order('created_at', { ascending: false })
    if (data) setGallery(data)
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    if (data) setCategories(data)
  }

  const loadSettings = async () => {
    const { data } = await supabase.from('store_settings').select('*')
    if (data) {
      const s = { whatsapp: '', instagram: '', email: '' }
      data.forEach(item => {
        if (item.key === 'whatsapp') s.whatsapp = item.value
        if (item.key === 'instagram') s.instagram = item.value
        if (item.key === 'email') s.email = item.value
      })
      setSettings(s)
    }
  }

  const loadOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ estado: newStatus }).eq('id', id)
    if (error) alert('Error actualizando estado: ' + error.message)
    else setOrders(orders.map(o => o.id === id ? { ...o, estado: newStatus } : o))
  }

  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) return
    if (!confirm(`¿Estás seguro de que quieres borrar ${selectedOrders.length} venta(s)? Esta acción no se puede deshacer.`)) return

    const res = await deleteOrdersAction(selectedOrders)
    if (!res.success) {
      alert('Error al borrar ventas: ' + res.error)
    } else {
      setOrders(orders.filter(o => !selectedOrders.includes(o.id)))
      setSelectedOrders([])
    }
  }

  const toggleSelectAllOrders = () => {
    if (selectedOrders.length === orders.length && orders.length > 0) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  // ================= MEDIA ACTIONS =================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setIsUploading(true)
    const files = Array.from(e.target.files)
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen ${file.name} supera los 5MB permitidos.`)
        continue
      }
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('products-images').upload(`uploads/${fileName}`, file)
      if (error) alert(`Error subiendo ${file.name}: ` + error.message)
    }
    setIsUploading(false)
    if (e.target) e.target.value = ''
    loadMedia()
  }

  const handleDeleteMedia = async (path: string) => {
    if (!confirm('¿Eliminar imagen de la nube? Esto podría romper productos que la estén usando.')) return
    const { error } = await supabase.storage.from('products-images').remove([path])
    if (error) alert('Error eliminando: ' + error.message)
    else setMediaList(mediaList.filter(m => m.path !== path))
  }

  // ================= PRODUCTS ACTIONS =================
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else setProducts(products.filter(p => p.id !== id))
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProduct = {
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string),
      categoria: formData.get('categoria') as string,
      image_url: tempImageUrl,
      destacado: tempDestacado
    }

    if (isEditing) {
      // @ts-ignore
      const { data, error } = await supabase.from('products').update(newProduct as any).eq('id', isEditing.id).select()
      if (error) alert('Error: ' + error.message)
      else if (data) {
        setProducts(products.map(p => p.id === isEditing.id ? data[0] : p))
        setIsEditing(null)
      }
    } else if (isCreating) {
      // @ts-ignore
      const { data, error } = await supabase.from('products').insert([newProduct as any]).select()
      if (error) alert('Error: ' + error.message)
      else if (data) {
        setProducts([data[0], ...products])
        setIsCreating(false)
      }
    }
  }

  // ================= GALLERY ACTIONS =================
  const handleAddImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tempImageUrl) return alert("Selecciona una imagen.")
    const res = await addHeroImageAction(tempImageUrl)
    if (!res.success) alert('Error: ' + res.error)
    else {
      if (res.data) setGallery([res.data[0], ...gallery])
      setIsAddingImage(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('¿Quitar de la portada?')) return
    const res = await deleteHeroImageAction(id)
    if (!res.success) alert('Error: ' + res.error)
    else setGallery(gallery.filter(g => g.id !== id))
  }

  // ================= CATEGORIES ACTIONS =================
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nombre = formData.get('nombre') as string
    const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    const { data, error } = await supabase.from('categories').insert([{ nombre, slug }]).select()
    if (error) alert('Error: ' + error.message)
    else if (data) {
      setCategories([...categories, data[0]])
      setIsCreatingCategory(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los productos que la usan podrían quedar sin categoría.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else setCategories(categories.filter(c => c.id !== id))
  }

  // ================= SETTINGS ACTIONS =================
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSavingSettings(true)
    const formData = new FormData(e.currentTarget)
    const updates = [
      { key: 'whatsapp', value: formData.get('whatsapp') as string },
      { key: 'instagram', value: formData.get('instagram') as string },
      { key: 'email', value: formData.get('email') as string }
    ]

    const { error } = await supabase.from('store_settings').upsert(updates, { onConflict: 'key' })
    if (error) {
      console.error(error)
      alert('Hubo un error al guardar: ' + error.message)
    } else {
      alert('Ajustes guardados correctamente.')
    }
    setIsSavingSettings(false)
  }

  return (
    <div>
      {/* Tabs Menu */}
      <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-2 overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('products')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'products' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Productos
        </button>
        <button onClick={() => setActiveTab('categories')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Categorías
        </button>
        <button onClick={() => setActiveTab('gallery')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'gallery' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Galería (Portada)
        </button>
        <button onClick={() => setActiveTab('media')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'media' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Archivos (Nube)
        </button>
        <button onClick={() => setActiveTab('settings')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'settings' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Ajustes Tienda
        </button>
        <button onClick={() => setActiveTab('ventas')} className={`pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'ventas' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Ventas
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <>
          <button 
            onClick={() => { setTempImageUrl(''); setTempDestacado(false); setIsCreating(true); }}
            className="mb-6 flex items-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white px-4 py-2 rounded-md transition-all"
          >
            <Plus size={18} /> Nuevo Producto
          </button>

          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/40">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium text-center">Destacado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {product.image_url && <img src={product.image_url} alt="" className="w-10 h-10 object-cover rounded-md border border-zinc-800" />}
                      <span className="font-medium text-zinc-200">{product.nombre}</span>
                    </td>
                    <td className="px-4 py-3">${product.precio}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3 capitalize">
                      {product.categoria ? (
                        product.categoria
                      ) : (
                        <span className="text-red-500 flex items-center gap-1 text-xs font-bold" title="Este producto no se mostrará a los clientes hasta que le asignes una categoría.">
                          ⚠️ Sin categoría
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {/* @ts-ignore */}
                      {product.destacado ? <Star size={16} className="text-yellow-500 fill-yellow-500 inline" /> : <span className="text-zinc-700">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => {
                        setTempImageUrl(product.image_url || '')
                        // @ts-ignore
                        setTempDestacado(product.destacado || false)
                        setIsEditing(product)
                      }} className="text-zinc-400 hover:text-accent-violet transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500">No hay productos. ¡Crea el primero!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="max-w-2xl">
          <button 
            onClick={() => setIsCreatingCategory(true)}
            className="mb-6 flex items-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white px-4 py-2 rounded-md transition-all"
          >
            <Plus size={18} /> Nueva Categoría
          </button>
          
          <div className="bg-black/40 border border-zinc-800 rounded-lg overflow-hidden">
            <ul className="divide-y divide-zinc-800/50">
              {categories.map(cat => (
                <li key={cat.id} className="px-4 py-3 flex justify-between items-center hover:bg-zinc-900/30">
                  <div>
                    <p className="text-zinc-200 font-medium">{cat.nombre}</p>
                    <p className="text-zinc-500 text-xs font-mono">Slug: {cat.slug}</p>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-zinc-500 hover:text-red-500 p-2">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
              {categories.length === 0 && <li className="px-4 py-6 text-center text-zinc-500">No hay categorías.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === 'gallery' && (
        <>
          <button onClick={() => { 
            if (mediaList.length === 0) loadMedia();
            setIsSelectingImage({ onSelect: async (url) => {
              const res = await addHeroImageAction(url)
              if (!res.success) alert('Error: ' + res.error)
              else if (res.data) setGallery([res.data[0], ...gallery])
            }})
          }} className="mb-6 flex items-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white px-4 py-2 rounded-md transition-all">
            <Plus size={18} /> Añadir Imagen a Portada
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-900">
                <img 
                  src={item.image_url} 
                  alt="Gallery" 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
                  onClick={() => setIsViewingImage(item.image_url)}
                />
                <button onClick={() => handleDeleteImage(item.id)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {gallery.length === 0 && <p className="text-zinc-500 text-sm">No hay imágenes en la portada.</p>}
          </div>
        </>
      )}

      {/* MEDIA TAB */}
      {activeTab === 'media' && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg text-zinc-200 font-medium">Gestor de Archivos (Nube)</h2>
            <label className="cursor-pointer flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white px-4 py-2 rounded-md transition-all">
              <Upload size={18} /> {isUploading ? 'Subiendo...' : 'Subir Archivos'}
              <input type="file" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {mediaList.map(media => (
              <div key={media.path} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-900">
                <img 
                  src={media.url} 
                  alt={media.name} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
                  onClick={() => setIsViewingImage(media.url)}
                />
                <button onClick={() => handleDeleteMedia(media.path)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <p className="text-[10px] text-zinc-300 truncate text-center">{media.name}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-xl">
          <form onSubmit={handleSaveSettings} className="bg-black/40 border border-zinc-800 p-6 rounded-lg flex flex-col gap-5">
            <h2 className="text-xl font-serif text-accent-violet">Información de Contacto</h2>
            <p className="text-sm text-zinc-400 mb-2">Estos datos se mostrarán en el pie de página y en la página de contactos.</p>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-300">Número de WhatsApp (con código de país)</label>
              <input required name="whatsapp" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="bg-black/50 border border-zinc-700 rounded p-2 focus:border-accent-violet outline-none" placeholder="+54 9 351 284-9228" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-300">Usuario de Instagram (sin el @)</label>
              <input required name="instagram" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="bg-black/50 border border-zinc-700 rounded p-2 focus:border-accent-violet outline-none" placeholder="delmichiaccesorios" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-300">Correo Electrónico Público</label>
              <input required type="email" name="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="bg-black/50 border border-zinc-700 rounded p-2 focus:border-accent-violet outline-none" placeholder="contacto@delmichi.com" />
            </div>
            
            <button type="submit" disabled={isSavingSettings} className="mt-4 flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors">
              <Save size={18} /> {isSavingSettings ? 'Guardando...' : 'Guardar Ajustes'}
            </button>
          </form>
        </div>
      )}

      {/* VENTAS TAB */}
      {activeTab === 'ventas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-heading text-white">Registro de Ventas</h2>
            {selectedOrders.length > 0 && (
              <button 
                onClick={handleDeleteOrders}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-500 rounded border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors text-sm"
              >
                <Trash2 size={16} />
                Borrar {selectedOrders.length} venta(s)
              </button>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/40">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-zinc-700 bg-zinc-900 accent-accent-violet"
                      checked={orders.length > 0 && selectedOrders.length === orders.length}
                      onChange={toggleSelectAllOrders}
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Producto(s)</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Cantidad</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map(order => (
                <tr key={order.id} className={`transition-colors ${selectedOrders.includes(order.id) ? 'bg-accent-violet/10' : 'hover:bg-zinc-900/30'}`}>
                  <td className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-zinc-700 bg-zinc-900 accent-accent-violet"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-200">
                    {order.items?.map((item: any) => item.nombre).join(', ') || 'Producto Desconocido'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-zinc-300">{order.direccion_envio?.nombre || 'Sin nombre'}</span>
                      <span className="text-xs text-zinc-500">{order.cliente_email || order.id.slice(0,8)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={order.estado} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium bg-black border ${order.estado === 'completado' || order.estado === 'vendido' ? 'border-green-500/50 text-green-500' : 'border-yellow-500/50 text-yellow-500'} focus:outline-none`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="vendido">Vendido</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0}
                  </td>
                  <td className="px-4 py-3 font-bold text-accent-violet">${order.total}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">No hay ventas registradas aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* MODALS ========================================== */}

      {/* Modal Creating Category */}
      {isCreatingCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0512] border border-accent-violet/30 p-6 rounded-lg w-full max-w-sm relative shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <button onClick={() => setIsCreatingCategory(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-xl font-serif text-accent-violet mb-4">Nueva Categoría</h2>
            <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Nombre de la categoría</label>
                <input required name="nombre" className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" placeholder="Ej: Anillos" />
              </div>
              <button type="submit" className="mt-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors">
                Crear
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Image Selector */}
      {isSelectingImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0a0512] border border-zinc-800 p-6 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col relative shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif text-accent-violet">Seleccionar de Galería</h2>
              <button onClick={() => setIsSelectingImage(null)} className="text-zinc-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {mediaList.map(media => (
                  <div key={media.path} onClick={() => { isSelectingImage.onSelect(media.url); setIsSelectingImage(null); }} className="cursor-pointer relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-900 hover:border-accent-violet transition-colors">
                    <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs text-zinc-500">Haz clic en una imagen para seleccionarla.</span>
              <label className="cursor-pointer flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded text-sm transition-all">
                <Upload size={14} /> Subir nueva
                <input type="file" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={async (e) => await handleFileUpload(e)} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal Full Screen Image Viewer */}
      {isViewingImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] p-4 backdrop-blur-sm" onClick={() => setIsViewingImage(null)}>
          <button onClick={() => setIsViewingImage(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 z-50">
            <X size={32} />
          </button>
          <img 
            src={isViewingImage} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain border border-zinc-800 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal Creating/Editing Product */}
      {(isEditing || isCreating) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0512] border border-accent-violet/30 p-6 rounded-lg w-full max-w-lg relative shadow-[0_0_20px_rgba(138,43,226,0.15)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => { setIsEditing(null); setIsCreating(false) }} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-xl font-serif text-accent-violet mb-4">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
            
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">Imagen del Producto</label>
                {tempImageUrl ? (
                  <div className="relative aspect-square w-32 rounded-lg overflow-hidden border border-zinc-700 bg-black group mx-auto">
                    <img src={tempImageUrl} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setTempImageUrl('')} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { if (mediaList.length === 0) loadMedia(); setIsSelectingImage({ onSelect: (url) => setTempImageUrl(url) }) }} className="h-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:text-accent-violet hover:border-accent-violet transition-all">
                    <ImageIcon size={24} className="mb-2" /><span>Elegir de Galería</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Nombre</label>
                <input required name="nombre" defaultValue={isEditing?.nombre} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-xs text-zinc-400">Precio ($)</label>
                  <input required type="number" step="0.01" name="precio" defaultValue={isEditing?.precio} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-xs text-zinc-400">Stock</label>
                  <input required type="number" name="stock" defaultValue={isEditing?.stock || 0} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" />
                </div>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-zinc-400">Categoría</label>
                  <select required name="categoria" defaultValue={isEditing?.categoria || ''} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none">
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer border border-zinc-700 rounded p-2 bg-black/50 hover:bg-zinc-900 transition-colors">
                  <input type="checkbox" className="hidden" checked={tempDestacado} onChange={(e) => setTempDestacado(e.target.checked)} />
                  <Star size={18} className={tempDestacado ? "text-yellow-500 fill-yellow-500" : "text-zinc-500"} />
                  <span className={`text-sm ${tempDestacado ? 'text-yellow-500' : 'text-zinc-500'}`}>Destacado</span>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Descripción</label>
                <textarea name="descripcion" defaultValue={isEditing?.descripcion || ''} rows={3} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none"></textarea>
              </div>

              <button type="submit" className="mt-4 flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors">
                <Save size={18} /> Guardar Producto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
