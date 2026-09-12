import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedParams = await searchParams
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto mb-32">
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-3xl font-serif text-accent-violet/90 mb-2">Acceso a tu Cuenta</h1>
        <p className="text-sm text-zinc-400">Inicia sesión o regístrate para comprar y ver tus pedidos.</p>
      </div>

      <LoginForm message={resolvedParams?.message} />
    </div>
  )
}
