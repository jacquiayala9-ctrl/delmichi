export const runtime = 'edge';
export default function CambiosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-[70vh]">
      <h1 className="text-3xl font-heading text-accent-violet mb-8">Cambios y Devoluciones</h1>
      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>Queremos que ames tu pieza de Delmichi. Si por alguna razón no estás satisfecho, contáctanos dentro de los primeros 7 días de haber recibido tu pedido.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Condiciones</h2>
        <p>El producto debe estar sin uso, en las mismas condiciones en las que lo recibiste y en su empaque original.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Productos Personalizados</h2>
        <p>Las piezas hechas a medida o personalizadas no tienen cambio ni devolución, a menos que presenten un defecto de fabricación.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Costos</h2>
        <p>Los costos de envío por cambios y devoluciones corren por cuenta del cliente, salvo que se trate de un error nuestro o defecto del producto.</p>
      </div>
    </div>
  )
}

