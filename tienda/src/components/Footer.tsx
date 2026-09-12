import Link from "next/link";
import { Camera, MessageCircle, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050209] border-t border-border-violet pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-xl tracking-widest text-foreground">DELMICHI</span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed">
              Joyería alternativa, artesanal y atrevida. Diseños únicos para almas oscuras que buscan destacar con elegancia.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4 text-foreground">Categorías</h3>
            <ul className="space-y-3">
              <li><Link href="/catalogo?categoria=chokers" className="text-secondary hover:text-accent-violet text-sm transition-colors">Chokers & Collares</Link></li>
              <li><Link href="/catalogo?categoria=anillos" className="text-secondary hover:text-accent-violet text-sm transition-colors">Anillos</Link></li>
              <li><Link href="/catalogo?categoria=pulseras" className="text-secondary hover:text-accent-violet text-sm transition-colors">Pulseras</Link></li>
              <li><Link href="/catalogo?categoria=accesorios" className="text-secondary hover:text-accent-violet text-sm transition-colors">Accesorios</Link></li>
            </ul>
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-[#12071f] p-2 rounded-full border border-border-violet text-secondary hover:text-accent-violet hover:border-accent-violet hover:shadow-glow transition-all duration-300">
                <Camera size={18} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="bg-[#12071f] p-2 rounded-full border border-border-violet text-secondary hover:text-accent-violet hover:border-accent-violet hover:shadow-glow transition-all duration-300">
                <Video size={18} /> 
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="bg-[#12071f] p-2 rounded-full border border-border-violet text-secondary hover:text-accent-violet hover:border-accent-violet hover:shadow-glow transition-all duration-300">
                <MessageCircle size={18} />
              </a>
            </div>
            <p className="text-secondary text-sm">
              Únete al aquelarre y recibe ofertas exclusivas.
            </p>
          </div>
          
        </div>
        
        <div className="border-t border-border-violet/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Delmichi. Todos los derechos reservados.
          </p>
          <p className="text-secondary/50 text-xs">
            Diseñado con oscuridad y pasión.
          </p>
        </div>
      </div>
    </footer>
  );
}
