"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCart";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function ProductCard({ id, name, price, category, imageUrl }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      nombre: name,
      precio: price,
      categoria: category,
      image_url: imageUrl,
      descripcion: null,
      stock: 1,
      destacado: false,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="group relative flex flex-col bg-[#0c0514] border border-border-violet rounded-none overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      
      {/* Image Container */}
      <Link href={`/producto/${id}`} className="block relative w-full aspect-[4/5] overflow-hidden bg-[#12071f]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09040e] to-transparent opacity-60 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"></div>
        {/* Placeholder text incase image fails or is loading */}
        <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
          <span className="font-heading opacity-30 text-4xl">D</span>
        </div>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 z-10"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-5 flex flex-col flex-grow z-20 relative bg-gradient-to-t from-[#09040e] to-[#0c0514]">
        <span className="text-accent-violet text-[0.45rem] sm:text-[0.65rem] uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-0.5 sm:mb-1.5 font-semibold truncate">
          {category}
        </span>
        <Link href={`/producto/${id}`} className="block mb-1 sm:mb-2">
          <h3 className="font-heading text-xs sm:text-lg text-foreground hover:text-accent-violet transition-colors line-clamp-2 leading-tight sm:leading-snug">
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-1 sm:pt-4">
          <span className="text-foreground text-[0.65rem] sm:text-base font-medium">
            ${price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
          <button 
            onClick={handleAddToCart}
            className="text-secondary hover:text-foreground bg-[#1a0f2e] hover:bg-accent-violet border border-border-violet hover:border-transparent p-2 rounded-none transition-all duration-300 hover:shadow-glow"
            aria-label="Añadir al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
