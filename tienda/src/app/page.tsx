import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/database";

// Opt-out of caching so it fetches fresh data or revalidates often
export const revalidate = 60;

export default async function Home() {
  // Fetch featured products
  let featuredProducts: Product[] | null = null;
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("destacado", true)
      .order("created_at", { ascending: false });

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

        {/* Featured Products */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border-violet/30">
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
              Ver Catálogo Completo
            </Link>
          </div>
        </section>

        {/* Pedido Personalizado Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-accent-violet mb-6">¿Buscas algo Único?</h2>
          <p className="text-zinc-400 mb-10 leading-relaxed text-lg">
            Realizamos pedidos personalizados. Si tienes un diseño en mente o quieres adaptar alguna de nuestras piezas a tus medidas, no dudes en escribirnos. Forjamos tus ideas en la realidad.
          </p>
          <Link 
            href="/contactos" 
            className="inline-block bg-accent-violet hover:bg-white hover:text-black text-white px-10 py-4 uppercase tracking-widest text-sm font-medium transition-all duration-300 shadow-glow"
          >
            Hacer Pedido Personalizado
          </Link>
        </section>

      </div>
    </div>
  );
}
