export const runtime = 'edge';
export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-[70vh]">
      <h1 className="text-3xl font-heading text-accent-violet mb-8">Términos y Condiciones</h1>
      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>Al acceder y realizar una compra en Delmichi, aceptas nuestros términos y condiciones de servicio.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Propiedad Intelectual</h2>
        <p>Todos los diseños, fotografías y contenidos de este sitio web son propiedad exclusiva de Delmichi y no pueden ser reproducidos sin nuestra autorización.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Precios y Pagos</h2>
        <p>Nos reservamos el derecho de modificar los precios en cualquier momento. Los pagos se procesan a través de plataformas seguras y no almacenamos información de tus tarjetas.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Disponibilidad</h2>
        <p>Dado el carácter artesanal de nuestro trabajo, los insumos pueden agotarse. Si un material no está disponible tras tu compra, nos contactaremos para ofrecerte una alternativa o la devolución de tu dinero.</p>
      </div>
    </div>
  )
}

