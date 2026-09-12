"use client";

import { useRouter } from "next/navigation";

interface Category {
  label: string;
  value: string;
}

interface MobileCategorySelectProps {
  categories: Category[];
  currentCategory: string | null;
  sortOption: string | null;
}

export default function MobileCategorySelect({ categories, currentCategory, sortOption }: MobileCategorySelectProps) {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchParams = new URLSearchParams();
    const cat = e.target.value;
    
    if (cat && cat !== "todos") searchParams.set("categoria", cat);
    if (sortOption) searchParams.set("orden", sortOption);
    
    router.push(`/productos?${searchParams.toString()}`);
  };

  return (
    <div className="relative md:hidden">
      <select 
        className="w-full appearance-none bg-[#12071f] border border-border-violet/50 text-secondary text-xs font-medium tracking-widest uppercase p-4 pr-10 focus:outline-none focus:border-accent-violet focus:shadow-glow transition-all"
        value={currentCategory || "todos"}
        onChange={handleSelect}
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-accent-violet">
        ▼
      </div>
    </div>
  );
}
