export const runtime = 'edge';
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Product } from "@/types/database";
import MobileCategorySelect from "@/components/MobileCategorySelect";
import SortSelect from "@/components/SortSelect";

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
  const searchQuery = typeof params.search === "string" ? params.search : null;

  // Base query (exclude products with null category)
  let query = supabase.from("products").select("*").not("categoria", "is", null);

  // Apply search query
  if (searchQuery) {
    query = query.ilike("nombre", `%${searchQuery}%`);
  }

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
    if (searchQuery) searchParams.set("search", searchQuery);
    
    if (cat) searchParams.set("categoria", cat);
    else if (categoryFilter) searchParams.set("categoria", categoryFilter);
    
    if (ord) searchParams.set("orden", ord);
    else if (sortOption) searchParams.set("orden", sortOption);
    
    return `/productos?${searchParams.toString()}`;
  };

  // Fetch dynamic categories
  let dbCategories: { nombre: string, slug: string }[] = [];
  try {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (data) dbCategories = data;
  } catch (err) {
    console.warn("Could not fetch categories", err);
  }

  const categories = [
    { label: "Todos", value: "todos" },
    ...dbCategories.map(c => ({ label: c.nombre, value: c.slug }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">NUESTROS PRODUCTOS</h1>
        <div className="w-24 h-0.5 bg-accent-violet shadow-glow mb-6"></div>
        <p className="text-secondary max-w-2xl">Articulos unicos y nuevos cada semana.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-heading text-foreground mb-4 border-b border-border-violet/30 pb-2 hidden md:block">Categorías</h2>
          
          {/* Desktop Categories */}
          <div className="hidden md:flex flex-col gap-2">
            {categories.map((cat) => {
              const isSelected = categoryFilter === cat.value || (!categoryFilter && cat.value === "todos");
              return (
                <Link 
                  key={cat.value}
                  href={getFilterUrl(cat.value)}
                  className={`px-4 py-3 text-xs tracking-widest uppercase transition-all duration-300 border-l-2 ${
                    isSelected 
                      ? 'border-accent-violet text-accent-violet font-bold bg-[#12071f]' 
                      : 'border-transparent text-secondary hover:border-accent-violet/50 hover:text-accent-violet'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Categories Select */}
          <MobileCategorySelect 
            categories={categories} 
            currentCategory={categoryFilter} 
            sortOption={sortOption} 
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {/* Header row with search info and sort select */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-border-violet/30 gap-4">
            <div className="text-secondary text-sm">
              {searchQuery ? (
                <span>Resultados de búsqueda para: <span className="text-accent-violet font-bold">"{searchQuery}"</span></span>
              ) : (
                <span>Mostrando {products?.length || 0} piezas en <span className="capitalize text-white">{categoryFilter || "Todos"}</span></span>
              )}
            </div>
            
            {/* Desktop sorting */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-secondary uppercase tracking-widest">Ordenar por:</span>
              <div className="relative">
                <SortSelect currentSort={sortOption} />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-accent-violet">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {(!products || products.length === 0) ? (
             <div className="text-center py-20 border border-border-violet/30 bg-[#12071f]/20">
               <h3 className="text-xl text-secondary font-heading mb-2">No se encontraron piezas</h3>
               <p className="text-secondary/60 text-sm">Vuelve pronto para ver nuestras novedades.</p>
             </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-6">
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
