const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ijtueoelejhgvjbynecb.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const dummyProducts = [
  {
    nombre: "Choker 'Nocturne' de Terciopelo y Luna",
    descripcion: "Choker ajustado de terciopelo negro con un dije central en forma de luna invertida. Ideal para looks grunge o gótico romántico.",
    precio: 14500,
    stock: 12,
    categoria: "chokers",
    image_url: "https://images.unsplash.com/photo-1599643478524-fb66f70a0066?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Anillo 'Obsidian Claw' Plata 925",
    descripcion: "Anillo de plata maciza con diseño de garras sosteniendo una piedra de ónix negro. Ajustable y unisex.",
    precio: 28900,
    stock: 5,
    categoria: "anillos",
    image_url: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Collar 'Holy Cross' Acero Quirúrgico",
    descripcion: "Cadena gruesa tipo eslabón cubano con una cruz gótica detallada. No se oxida ni pierde color.",
    precio: 18000,
    stock: 20,
    categoria: "collares",
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Set de Cadenas 'Witchcraft' Layered",
    descripcion: "Set de 3 cadenas asimétricas con dijes de pentagrama, daga y cristal de cuarzo negro.",
    precio: 22500,
    stock: 8,
    categoria: "collares",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Anillo Sello 'Memento Mori' Calavera",
    descripcion: "Anillo estilo sello pesado con relieve de calavera anatómica y rosas laterales.",
    precio: 31000,
    stock: 3,
    categoria: "anillos",
    image_url: "https://images.unsplash.com/photo-1590544521484-63304918e6ec?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Pulsera 'Spiked Cuff' de Cuero Vegan",
    descripcion: "Brazalete ancho de cuero sintético premium con tres filas de púas metálicas plateadas. Ajuste de hebilla.",
    precio: 19500,
    stock: 15,
    categoria: "pulseras",
    image_url: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Choker 'Vampire Blood' con Cristales",
    descripcion: "Elegante choker de encaje negro entrelazado con cristales rojos colgantes que simulan gotas.",
    precio: 16800,
    stock: 10,
    categoria: "chokers",
    image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
  },
  {
    nombre: "Aros 'Serpent' Enroscados",
    descripcion: "Pendientes en forma de serpiente que parecen atravesar el lóbulo. Plata envejecida.",
    precio: 15500,
    stock: 25,
    categoria: "accesorios",
    image_url: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop"
  }
];

async function seedDatabase() {
  console.log("Iniciando inyección de joyas en la base de datos...");
  
  // Limpiamos la tabla primero (opcional, pero útil para evitar duplicados en pruebas)
  // const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { data, error } = await supabase
    .from("products")
    .insert(dummyProducts)
    .select();

  if (error) {
    console.error("Error insertando productos:", error);
    return;
  }

  console.log(`¡Éxito! Se insertaron ${data.length} productos góticos/alternativos en el catálogo.`);
}

seedDatabase();
