import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Product } from "@/types/database";

// Optional: prevent caching for real-time inventory
export const dynamic = "force-dynamic";

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categoryFilter = typeof params.categoria === "string" ? params.categoria : null;
  const sortOption = typeof params.orden === "string" ? params.orden : "recientes";

  // Base query
  let query = supabase.from("products").select("*");

  // Apply category filter
  if (categoryFilter && categoryFilter !== "todos") {
    // Exact match or ILIKE depending on how strict you want to be
    query = query.ilike("categoria", `%${categoryFilter}%`);
  }

  // Apply sorting
  switch (sortOption) {
    case "menor_precio":
      query = query.order("precio", { ascending: true });
      break;
    case "mayor_precio":
      query = query.order("precio", { ascending: false });
      break;
    case "a_z":
      query = query.order("nombre", { ascending: true });
      break;
    case "z_a":
      query = query.order("nombre", { ascending: false });
      break;
    case "recientes":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  let products: Product[] | null = null;
  try {
    const { data, error } = await query;
    if (error) {
      console.warn("Supabase error (products):", error.message || error);
    } else {
      products = data as Product[] | null;
    }
  } catch (err) {
    console.warn("Network error fetching Supabase:", err);
  }

  // Helper function for creating filter URLs
  const getFilterUrl = (cat?: string, ord?: string) => {
    const searchParams = new URLSearchParams();
    if (cat) searchParams.set("categoria", cat);
    else if (categoryFilter) searchParams.set("categoria", categoryFilter);
    
    if (ord) searchParams.set("orden", ord);
    else if (sortOption) searchParams.set("orden", sortOption);
    
    return `/catalogo?${searchParams.toString()}`;
  };

  const categorias = ["Todos", "Chokers", "Collares", "Anillos", "Pulseras", "Accesorios"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Nuestro Catálogo</h1>
        <div className="w-24 h-0.5 bg-accent-violet shadow-glow mb-6"></div>
        <p className="text-secondary max-w-2xl">Descubre piezas únicas diseñadas para resaltar tu oscuridad interior.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Product Grid */}
        <div className="w-full">
          {(!products || products.length === 0) ? (
             <div className="text-center py-20 border border-border-violet/30 bg-[#12071f]/20">
               <h3 className="text-xl text-secondary font-heading mb-2">No se encontraron piezas</h3>
               <p className="text-secondary/60 text-sm">Vuelve pronto para ver nuestras novedades.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
        </div>
      </div>
    </div>
  );
}
