"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ 
  currentSort 
}: { 
  currentSort: string 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", newSort);
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <select 
      className="appearance-none bg-[#12071f] border border-border-violet/50 text-white text-sm py-1.5 pl-3 pr-8 rounded focus:outline-none focus:border-accent-violet cursor-pointer transition-colors"
      value={currentSort}
      onChange={handleSortChange}
    >
      <option value="recientes">Más recientes</option>
      <option value="menor_precio">Precio: Menor a Mayor</option>
      <option value="mayor_precio">Precio: Mayor a Menor</option>
      <option value="a_z">Nombre: A - Z</option>
      <option value="z_a">Nombre: Z - A</option>
    </select>
  );
}
