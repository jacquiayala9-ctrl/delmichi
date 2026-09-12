'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm({ message }: { message?: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      }
    })
    
    if (error) {
      console.error('Error con Google login:', error)
    }
  }

  return (
    <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground bg-black/40 p-8 rounded-lg border border-accent-violet/30 shadow-[0_0_15px_rgba(138,43,226,0.1)]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-black/60 border border-zinc-700 focus:border-accent-violet focus:ring-1 focus:ring-accent-violet outline-none transition-all placeholder:text-zinc-600 text-sm"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
      </div>
      
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
          Contraseña
        </label>
        <input
          className="rounded-md px-4 py-2 bg-black/60 border border-zinc-700 focus:border-accent-violet focus:ring-1 focus:ring-accent-violet outline-none transition-all placeholder:text-zinc-600 text-sm"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
      </div>

      {!isLogin && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="confirm_password">
            Repetir Contraseña
          </label>
          <input
            className="rounded-md px-4 py-2 bg-black/60 border border-zinc-700 focus:border-accent-violet focus:ring-1 focus:ring-accent-violet outline-none transition-all placeholder:text-zinc-600 text-sm"
            type="password"
            name="confirm_password"
            placeholder="••••••••"
            required={!isLogin}
          />
        </div>
      )}
      
      <div className="flex flex-col gap-3 mt-6">
        <button
          formAction={isLogin ? login : signup}
          className="bg-accent-violet hover:bg-white hover:text-black font-semibold rounded-md px-4 py-2 transition-all"
        >
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </button>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md px-4 py-2 text-sm transition-all"
        >
          {isLogin ? '¿No tienes cuenta? Crea una nueva' : 'Ya tengo cuenta, iniciar sesión'}
        </button>
      </div>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs">O</span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-zinc-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="21.17" y1="8" x2="12" y2="8"></line>
          <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
          <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
        </svg>
        Continuar con Google
      </button>

      {message && (
        <div className="mt-4 p-4 bg-red-950/40 border border-red-900/50 text-red-400 text-sm rounded-md text-center">
          {message}
        </div>
      )}
    </form>
  )
}
