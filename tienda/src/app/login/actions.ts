'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=No se pudo iniciar sesión. Verifica tus credenciales.')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user 
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  revalidatePath('/', 'layout')
  if ((profile as any)?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/perfil/mis-compras')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    return redirect('/login?message=Las contraseñas no coinciden.')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=No se pudo crear la cuenta.')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Revisa tu correo para confirmar tu cuenta.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
