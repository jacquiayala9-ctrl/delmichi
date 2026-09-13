import { createClient } from "@supabase/supabase-js"

export const revalidate = 3600; // Revalidate every hour instead of 0 (dynamic)

export default async function ContactosPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: settings } = await supabase.from('store_settings').select('*')
  
  let whatsapp = '+54 9 351 284-9228'
  let instagram = 'delmichi_cba'
  let email = 'contacto@delmichi.com'

  if (settings) {
    settings.forEach(s => {
      if (s.key === 'whatsapp') whatsapp = s.value
      if (s.key === 'instagram') instagram = s.value
      if (s.key === 'email') email = s.value
    })
  }

  // Generate links
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hola,%20vengo%20desde%20la%20p%C3%A1gina%20web%20y%20tengo%20una%20consulta.`
  const instagramUrl = `https://instagram.com/${instagram}`
  const mailUrl = `mailto:${email}?subject=Consulta%20-%20Delmichi`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-heading text-accent-violet mb-4">Contáctanos</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          ¿Tienes alguna duda, quieres un diseño a medida o necesitas ayuda con tu pedido? 
          Escríbenos por cualquiera de nuestros canales oficiales y te responderemos a la brevedad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0a0512] border border-zinc-800 hover:border-[#25D366] rounded-lg p-8 flex flex-col items-center text-center transition-all group">
          <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2 group-hover:text-[#25D366] transition-colors">WhatsApp</h3>
          <p className="text-zinc-400 text-sm mb-4">Atención rápida y pedidos personalizados.</p>
          <span className="text-[#25D366] text-sm uppercase tracking-wider font-medium">Enviar Mensaje &rarr;</span>
        </a>

        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0a0512] border border-zinc-800 hover:border-[#E1306C] rounded-lg p-8 flex flex-col items-center text-center transition-all group">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#F56040] via-[#E1306C] to-[#833AB4] text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2 group-hover:text-[#E1306C] transition-colors">Instagram</h3>
          <p className="text-zinc-400 text-sm mb-4">Mira nuestras últimas creaciones y novedades.</p>
          <span className="text-[#E1306C] text-sm uppercase tracking-wider font-medium">Ver Perfil &rarr;</span>
        </a>

        <a href={mailUrl} className="bg-[#0a0512] border border-zinc-800 hover:border-[#EA4335] rounded-lg p-8 flex flex-col items-center text-center transition-all group">
          <div className="w-16 h-16 bg-[#EA4335]/10 text-[#EA4335] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2 group-hover:text-[#EA4335] transition-colors">Gmail</h3>
          <p className="text-zinc-400 text-sm mb-4">Para consultas generales o empresariales.</p>
          <span className="text-[#EA4335] text-sm uppercase tracking-wider font-medium">Enviar Correo &rarr;</span>
        </a>
      </div>
    </div>
  )
}


