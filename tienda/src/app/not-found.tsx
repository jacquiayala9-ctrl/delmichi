export const runtime = 'edge';

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center text-[#e0e0e0]">
      <h2 className="text-4xl font-serif text-delmichi-accent mb-4">404 - Página No Encontrada</h2>
      <p className="mb-8">Parece que la página que buscas no existe o fue movida.</p>
      <Link href="/" className="px-6 py-2 bg-delmichi-accent text-white font-medium hover:bg-violet-600 transition-colors">
        Volver al Inicio
      </Link>
    </div>
  )
}
