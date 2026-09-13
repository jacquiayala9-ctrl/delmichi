export const runtime = 'edge';
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Truck, RefreshCcw } from "lucide-react";
import { Product } from "@/types/database";
import ProductActions from "@/components/ProductActions";
import FavoriteButton from "@/components/FavoriteButton";

// Forcing dynamic so we always get the latest stock
export const dynamic = "force-dynamic";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validate UUID (optional but good practice)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    notFound();
  }

  // Fetch product from Supabase
  let product: Product | null = null;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    product = data as Product | null;
    if (error) {
      console.warn("Supabase error (product details):", error.message || error);
    }
  } catch (err) {
    console.warn("Network error fetching Supabase:", err);
  }

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Breadcrumb / Back button */}
      <Link href="/productos" className="inline-flex items-center text-sm text-secondary hover:text-accent-violet transition-colors mb-8 group">
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Volver al catálogo
      </Link>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        
        {/* Product Image (Left) */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-[4/5] bg-[#0c0514] border border-border-violet overflow-hidden group">
            <FavoriteButton productId={product.id} className="absolute bottom-4 right-4 z-30" />
            
            {/* Dark vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#09040e_100%)] z-10 pointer-events-none opacity-50"></div>
            
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.nombre}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading opacity-10 text-9xl">D</span>
              </div>
            )}
            
            {isOutOfStock && (
              <div className="absolute top-4 right-4 z-20 bg-red-900/80 border border-red-500/50 text-white text-xs uppercase tracking-widest px-3 py-1 font-bold backdrop-blur-sm">
                Agotado
              </div>
            )}
          </div>
        </div>

        {/* Product Info (Right) */}
        <div className="w-full md:w-1/2 flex flex-col pt-2 md:pt-10">
          
          <span className="text-accent-violet text-sm uppercase tracking-[0.2em] font-semibold mb-2">
            {product.categoria || "Accesorio"}
          </span>
          
          <h1 className="font-heading text-3xl md:text-5xl text-foreground mb-4">
            {product.nombre}
          </h1>
          
          <div className="text-3xl font-medium text-foreground mb-8 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            ${product.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </div>

          <div className="prose prose-invert prose-p:text-secondary max-w-none mb-10">
            <p>{product.descripcion || "Una pieza única de diseño alternativo forjada con oscuridad y pasión. Perfecta para quienes buscan destacar entre la multitud con un estilo inconfundible."}</p>
          </div>

          {/* Action Area */}
          <ProductActions product={product} />

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex items-start gap-3 p-4 border border-border-violet/30 bg-[#0c0514]/50">
              <Truck className="text-accent-violet mt-1" size={20} />
              <div>
                <h4 className="text-sm font-medium text-foreground">Envíos a todo el país</h4>
                <p className="text-xs text-secondary mt-1">Gratis en compras mayores a $50.000</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-border-violet/30 bg-[#0c0514]/50">
              <RefreshCcw className="text-accent-violet mt-1" size={20} />
              <div>
                <h4 className="text-sm font-medium text-foreground">Cambios garantizados</h4>
                <p className="text-xs text-secondary mt-1">Tienes 30 días para cambiar tu pieza</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
