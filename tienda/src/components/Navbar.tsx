"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCart";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const totalItems = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    // Escuchar cambios de autenticación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])

  return (
    <>
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-[#09040e]/95 backdrop-blur-md border-b border-border-violet' : 'bg-[#09040e]/80 backdrop-blur-sm border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section (Left) */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/images/logo_transparent.png" 
                    alt="Delmichi Logo" 
                    fill 
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xl sm:text-2xl tracking-widest text-foreground group-hover:text-accent-violet transition-colors duration-300">
                    DELMICHI
                  </span>
                  <span className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-secondary mt-0.5">
                    Joyas & Accesorios
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Center) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`text-sm tracking-widest uppercase transition-colors hover:text-accent-violet ${pathname === '/' ? 'text-accent-violet font-medium' : 'text-secondary'}`}>
                Inicio
              </Link>
              
              {/* Productos Dropdown */}
              <div className="group relative">
                <Link href="/catalogo" className={`text-sm tracking-widest uppercase transition-colors hover:text-accent-violet flex items-center gap-1 ${pathname.includes('/catalogo') ? 'text-accent-violet font-medium' : 'text-secondary'}`}>
                  Productos
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#0c0514] border border-border-violet/50 shadow-glow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-col py-2">
                    <Link href="/catalogo" className="px-4 py-2 text-xs uppercase tracking-widest text-secondary hover:text-accent-violet hover:bg-[#12071f] transition-colors">
                      Ver Todo
                    </Link>
                    <div className="my-1 border-t border-border-violet/30"></div>
                    <Link href="/catalogo?categoria=chokers" className="px-4 py-2 text-xs uppercase tracking-widest text-secondary hover:text-accent-violet hover:bg-[#12071f] transition-colors">
                      Chokers & Collares
                    </Link>
                    <Link href="/catalogo?categoria=anillos" className="px-4 py-2 text-xs uppercase tracking-widest text-secondary hover:text-accent-violet hover:bg-[#12071f] transition-colors">
                      Anillos y Midis
                    </Link>
                    <Link href="/catalogo?categoria=pulseras" className="px-4 py-2 text-xs uppercase tracking-widest text-secondary hover:text-accent-violet hover:bg-[#12071f] transition-colors">
                      Pulseras
                    </Link>
                    <Link href="/catalogo?categoria=accesorios" className="px-4 py-2 text-xs uppercase tracking-widest text-secondary hover:text-accent-violet hover:bg-[#12071f] transition-colors">
                      Accesorios
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/contacto" className={`text-sm tracking-widest uppercase transition-colors hover:text-accent-violet ${pathname === '/contacto' ? 'text-accent-violet font-medium' : 'text-secondary'}`}>
                Contacto
              </Link>
            </div>

            {/* Actions (Right) */}
            <div className="flex items-center space-x-5">
              <button className="text-secondary hover:text-accent-violet transition-colors hidden sm:block" aria-label="Buscar">
                <Search size={20} />
              </button>
              <Link href={user ? "/perfil/mis-compras" : "/login"} className="text-secondary hover:text-accent-violet transition-colors" aria-label="Perfil">
                <User size={20} />
              </Link>
              <Link href="/carrito" className="text-secondary hover:text-accent-violet transition-colors relative" aria-label="Carrito">
                <ShoppingBag size={20} />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-accent-violet text-white text-[0.65rem] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse shadow-glow">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <div className="flex md:hidden items-center ml-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-secondary hover:text-foreground transition-colors" 
                  aria-label="Menú"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0c0514] border-b border-border-violet/50 absolute w-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="px-4 pt-4 pb-8 space-y-4 flex flex-col">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="px-2 py-2 text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-sm font-medium">Inicio</Link>
              
              <div className="px-2 py-2">
                <span className="text-foreground uppercase tracking-widest text-sm font-medium mb-3 block">Productos</span>
                <div className="flex flex-col pl-4 border-l border-border-violet/30 space-y-3 mt-2">
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalogo" className="text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-xs">Ver Todo</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalogo?categoria=chokers" className="text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-xs">Chokers & Collares</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalogo?categoria=anillos" className="text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-xs">Anillos y Midis</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalogo?categoria=pulseras" className="text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-xs">Pulseras</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalogo?categoria=accesorios" className="text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-xs">Accesorios</Link>
                </div>
              </div>
              
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contacto" className="px-2 py-2 text-secondary hover:text-accent-violet transition-all uppercase tracking-widest text-sm font-medium">Contacto</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
