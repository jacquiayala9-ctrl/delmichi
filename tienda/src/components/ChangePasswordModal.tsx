'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export default function ChangePasswordModal({ isOpen, onClose, userEmail }: Props) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    
    // Verificar contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: oldPassword,
    })

    if (signInError) {
      setError('La contraseña actual es incorrecta.')
      setLoading(false)
      return
    }

    // Actualizar contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#0a0512] border border-accent-violet/30 p-6 rounded-lg w-full max-w-sm relative shadow-[0_0_20px_rgba(138,43,226,0.15)]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-serif text-accent-violet mb-4">Cambiar Contraseña</h2>
        
        {success ? (
          <div className="bg-green-500/20 text-green-400 border border-green-500/50 p-3 rounded mb-4 text-sm text-center">
            ¡Contraseña actualizada con éxito!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-2 rounded text-xs">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Contraseña actual</label>
              <input 
                type="password" 
                required 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none text-white" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Nueva contraseña</label>
              <input 
                type="password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none text-white" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Repetir nueva contraseña</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-accent-violet outline-none text-white" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 bg-accent-violet hover:bg-accent-violet/80 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
