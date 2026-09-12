'use client'

import { useState } from 'react'
import { Product } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { Trash2, Edit, Plus, X, Save } from 'lucide-react'

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isEditing, setIsEditing] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Gallery state
  const [activeTab, setActiveTab] = useState<'products' | 'gallery'>('products')
  const [gallery, setGallery] = useState<{id: string, image_url: string, active: boolean}[]>([])
  const [isAddingImage, setIsAddingImage] = useState(false)
  
  const supabase = createClient()

  const loadGallery = async () => {
    const { data } = await supabase.from('hero_gallery').select('*').order('created_at', { ascending: false })
    if (data) setGallery(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Error eliminando: ' + error.message)
    else setProducts(products.filter(p => p.id !== id))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProduct = {
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      precio: parseFloat(formData.get('precio') as string),
      stock: parseInt(formData.get('stock') as string),
      categoria: formData.get('categoria') as string,
      image_url: formData.get('image_url') as string,
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

  // Gallery actions
  const handleAddImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get('image_url') as string
    
    // @ts-ignore
    const { data, error } = await supabase.from('hero_gallery').insert([{ image_url: url } as any]).select()
    if (error) alert('Error: ' + error.message)
    else {
      if (data) setGallery([data[0], ...gallery])
      setIsAddingImage(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('¿Quitar esta imagen de la portada?')) return
    const { error } = await supabase.from('hero_gallery').delete().eq('id', id)
    if (error) alert('Error eliminando: ' + error.message)
    else setGallery(gallery.filter(g => g.id !== id))
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-2">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`pb-2 px-2 transition-colors ${activeTab === 'products' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Productos
        </button>
        <button 
          onClick={() => { setActiveTab('gallery'); loadGallery() }} 
          className={`pb-2 px-2 transition-colors ${activeTab === 'gallery' ? 'text-accent-violet border-b-2 border-accent-violet font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Galería de Inicio
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <button 
            onClick={() => setIsCreating(true)}
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
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {product.image_url && (
                        <img src={product.image_url} alt="" className="w-10 h-10 object-cover rounded-md border border-zinc-800" />
                      )}
                      <span className="font-medium text-zinc-200">{product.nombre}</span>
                    </td>
                    <td className="px-4 py-3">${product.precio}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3 capitalize">{product.categoria}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setIsEditing(product)} className="text-zinc-400 hover:text-accent-violet transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <button 
            onClick={() => setIsAddingImage(true)}
            className="mb-6 flex items-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white px-4 py-2 rounded-md transition-all"
          >
            <Plus size={18} /> Añadir Imagen a Portada
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-square bg-zinc-900">
                <img src={item.image_url} alt="Gallery" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDeleteImage(item.id)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {gallery.length === 0 && <p className="text-zinc-500 text-sm">No hay imágenes en la portada.</p>}
          </div>
        </>
      )}

      {/* Modal Añadir Imagen Galería */}
      {isAddingImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0512] border border-accent-violet/30 p-6 rounded-lg w-full max-w-lg relative shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <button onClick={() => setIsAddingImage(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif text-accent-violet mb-4">Añadir a Portada</h2>
            <form onSubmit={handleAddImage} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">URL o ruta de la Imagen (ej: /images/SaveClip...jpg)</label>
                <input required name="image_url" className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" placeholder="/images/nueva_foto.jpg" />
              </div>
              <button type="submit" className="mt-4 flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors">
                <Save size={18} /> Añadir
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Producto */}
      {(isEditing || isCreating) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0512] border border-accent-violet/30 p-6 rounded-lg w-full max-w-lg relative shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <button onClick={() => { setIsEditing(null); setIsCreating(false) }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif text-accent-violet mb-4">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
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
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Categoría</label>
                <input required name="categoria" defaultValue={isEditing?.categoria || ''} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" placeholder="ej: anillos, chokers" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">URL de la Imagen</label>
                <input name="image_url" defaultValue={isEditing?.image_url || ''} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Descripción</label>
                <textarea name="descripcion" defaultValue={isEditing?.descripcion || ''} rows={3} className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none"></textarea>
              </div>
              <button type="submit" className="mt-4 flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors">
                <Save size={18} /> Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
