"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ productId, className }: { productId: string, className?: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();
          
        if (data) {
          setIsFavorited(true);
        }
      }
      setLoading(false);
    };
    checkFavorite();
  }, [productId, supabase]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (isFavorited) {
      setIsFavorited(false); // Optimistic UI update
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) setIsFavorited(true); // Revert on error
    } else {
      setIsFavorited(true); // Optimistic UI update
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });
        
      if (error) setIsFavorited(false); // Revert on error
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleFavorite}
      className={`${className || "absolute bottom-1 right-1 sm:bottom-2 sm:right-2"} p-1.5 z-30 transition-all duration-300 drop-shadow-md bg-black/20 rounded-full hover:bg-black/50 backdrop-blur-sm ${
        isFavorited 
          ? "text-yellow-400 hover:text-yellow-300" 
          : "text-zinc-300 hover:text-white"
      }`}
      aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <Star 
        size={14} 
        className={isFavorited ? "fill-current" : "opacity-80"} 
      />
    </button>
  );
}
