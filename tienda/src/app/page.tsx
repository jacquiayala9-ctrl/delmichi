import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/database";

// Opt-out of caching so it fetches fresh data or revalidates often
export const revalidate = 60;

export default async function Home() {
  // Fetch up to 4 latest products from Supabase
  let featuredProducts: Product[] | null = null;
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.warn("Supabase error (featured products):", error.message || error);
    } else {
      featuredProducts = data as Product[] | null;
    }
  } catch (err) {
    console.warn("Network error fetching Supabase:", err);
  }

  return (
    <div className="p-4 md:p-8 bg-[#050209]">
      <div className="flex flex-col border border-accent-violet/30 bg-[#09040e] rounded-sm overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        {/* Hero Dynamic Slider */}
        <HeroSlider />

        {/* Categorías Destacadas (Gallery Style) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border-violet/30">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-3">Descubre Tu Estilo</h2>
            <div className="w-12 h-0.5 bg-accent-violet shadow-glow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[800px] md:h-[500px]">
            {/* Chokers (Large left) */}
            <Link href="/productos?categoria=chokers%26collares" className="group relative overflow-hidden bg-[#12071f] md:row-span-2">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-70"></div>
              <Image 
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop" 
                alt="Chokers" 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="font-heading text-2xl text-white mb-1 group-hover:text-accent-violet transition-colors">Chokers</h3>
                <span className="text-xs uppercase tracking-widest text-zinc-300">Ver Colección →</span>
              </div>
            </Link>
            
            {/* Anillos (Top right) */}
            <Link href="/productos?categoria=anillos%26midis" className="group relative overflow-hidden bg-[#12071f] md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-70"></div>
              <Image 
                src="https://images.unsplash.com/photo-1590544521484-63304918e6ec?q=80&w=800&auto=format&fit=crop" 
                alt="Anillos" 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="font-heading text-2xl text-white mb-1 group-hover:text-accent-violet transition-colors">Anillos Sello</h3>
                <span className="text-xs uppercase tracking-widest text-zinc-300">Ver Colección →</span>
              </div>
            </Link>
            
            {/* Accesorios (Bottom right - half) */}
            <Link href="/productos?categoria=aros" className="group relative overflow-hidden bg-[#12071f]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-70"></div>
              <Image 
                src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop" 
                alt="Accesorios" 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="font-heading text-xl text-white mb-1 group-hover:text-accent-violet transition-colors">Aros</h3>
                <span className="text-xs uppercase tracking-widest text-zinc-300">Explorar →</span>
              </div>
            </Link>

            {/* Pulseras (Bottom right - half) */}
            <Link href="/productos?categoria=pulseras" className="group relative overflow-hidden bg-[#12071f]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-70"></div>
              <Image 
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop" 
                alt="Pulseras" 
                fill 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="font-heading text-xl text-white mb-1 group-hover:text-accent-violet transition-colors">Pulseras</h3>
                <span className="text-xs uppercase tracking-widest text-zinc-300">Explorar →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Piezas Destacadas</h2>
            <div className="w-16 h-0.5 bg-accent-violet shadow-glow"></div>
          </div>

          {(!featuredProducts || featuredProducts.length === 0) ? (
            <div className="text-center py-12 border border-border-violet/50 bg-[#12071f]/30">
              <h3 className="text-xl text-secondary font-heading mb-2">Próximamente nuevas colecciones</h3>
              <p className="text-secondary/60 text-sm">Estamos forjando nuestras próximas joyas en las sombras.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.nombre}
                  price={product.precio}
                  category={product.categoria || "Sin categoría"}
                  imageUrl={product.image_url || ""}
                />
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link 
              href="/productos" 
              className="inline-block border border-border-violet text-foreground hover:border-accent-violet hover:text-accent-violet hover:shadow-glow px-8 py-3 uppercase tracking-widest text-sm transition-all duration-300"
            >
              Ver Todo
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
