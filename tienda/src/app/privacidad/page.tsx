export const runtime = 'edge';
export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-[70vh]">
      <h1 className="text-3xl font-heading text-accent-violet mb-8">Aviso de Privacidad</h1>
      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>En Delmichi valoramos tu privacidad y nos comprometemos a proteger tus datos personales.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Uso de la Información</h2>
        <p>Los datos solicitados al crear una cuenta o realizar una compra (nombre, dirección, correo electrónico) se utilizarán exclusivamente para procesar tus pedidos y brindarte una mejor experiencia de compra.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Comunicaciones</h2>
        <p>Si te suscribes a nuestras novedades, podríamos enviarte correos electrónicos ocasionales. Puedes darte de baja en cualquier momento.</p>
        <h2 className="text-xl text-white font-medium mt-8 mb-4">Seguridad</h2>
        <p>Implementamos diversas medidas de seguridad para proteger tu información. No compartimos ni vendemos tus datos a terceros bajo ninguna circunstancia.</p>
      </div>
    </div>
  )
}

