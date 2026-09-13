import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Footer() {
  const supabase = await createClient()
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

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hola,%20vengo%20desde%20la%20p%C3%A1gina%20web%20y%20tengo%20una%20consulta.`
  const instagramUrl = `https://instagram.com/${instagram}`
  const mailUrl = `mailto:${email}`

  return (
    <footer className="bg-[#050209] border-t border-border-violet pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-xl tracking-widest text-foreground">DELMICHI</span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-2">
              Joyería y accesorios artesanales. Diseños únicos para destacar con elegancia.
            </p>
            <p className="text-zinc-500 text-xs">
              Plataforma de comercio electrónico.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-foreground">Políticas</h3>
            <ul className="space-y-3">
              <li><Link href="/envios" className="text-secondary hover:text-foreground text-sm transition-colors">Envíos y Entregas</Link></li>
              <li><Link href="/cambios" className="text-secondary hover:text-foreground text-sm transition-colors">Cambios y Devoluciones</Link></li>
              <li><Link href="/terminos" className="text-secondary hover:text-foreground text-sm transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="text-secondary hover:text-foreground text-sm transition-colors">Aviso de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-foreground">Conecta</h3>
            <div className="flex space-x-4 mb-6">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-[#12071f] p-2.5 rounded-full border border-border-violet text-secondary hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-glow transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#12071f] p-2.5 rounded-full border border-border-violet text-secondary hover:text-[#25D366] hover:border-[#25D366] hover:shadow-glow transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              <a href={mailUrl} className="bg-[#12071f] p-2.5 rounded-full border border-border-violet text-secondary hover:text-[#EA4335] hover:border-[#EA4335] hover:shadow-glow transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </a>
            </div>
            <p className="text-secondary text-sm">
              Síguenos en nuestras redes oficiales y entérate de nuestras novedades.
            </p>
          </div>
          
        </div>
        
        <div className="border-t border-border-violet/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Delmichi. Todos los derechos reservados.
          </p>
          <p className="text-secondary/50 text-xs">
            Desarrollado con 🖤
          </p>
        </div>
      </div>
    </footer>
  );
}
