export const runtime = 'edge';
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      // Usually Supabase requires email verification. Let's assume they don't or it's auto-confirm.
      setTimeout(() => {
        router.push('/perfil')
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#050209]">
      <div className="w-full max-w-md bg-[#0a0512] border border-border-violet/30 rounded-lg p-8 shadow-[0_0_20px_rgba(138,43,226,0.1)]">
        <h1 className="text-3xl font-heading text-accent-violet mb-6 text-center">Crear Cuenta</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded text-center">
            ¡Cuenta creada exitosamente! Redirigiendo...
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-accent-violet outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-accent-violet outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-accent-violet outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-violet hover:bg-white hover:text-black text-white font-medium py-3 rounded uppercase tracking-widest transition-all mt-6"
            >
              {loading ? 'Creando...' : 'Registrarse'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-accent-violet hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

