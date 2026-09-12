import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = {
  "chokers&collares": { image: "chokers_collares.jpg", prefix: "Choker" },
  "pulseras": { image: "pulseras.jpg", prefix: "Pulsera" },
  "aros": { image: "aros.jpg", prefix: "Aros" },
  "garters": { image: "garters.jpg", prefix: "Garter" },
  "cintos": { image: "cintos.jpg", prefix: "Cinto" },
  "medias": { image: "medias.jpg", prefix: "Medias" },
  "cancanes red": { image: "cancanes_red.jpg", prefix: "Cancan" },
  "guantes": { image: "guantes.jpg", prefix: "Guantes" }
};

const anillosImages = [
  "anillonegro.jpg", "azteca.jpg", "bordado.jpg", "calaveras.jpg", 
  "calaveras2.jpg", "cruz.jpg", "cuadrícula.jpg", "liso.jpg", 
  "palos.jpg", "rayas.jpg"
];

const adjectives = ["Oscuro", "Nocturno", "Infernal", "Gótico", "Vampírico", "Maldito", "Eterno", "Letal", "Supremo", "Sombrío"];

async function uploadImage(filename) {
  const filePath = path.resolve('..', 'galeria', filename);
  const fileBuffer = readFileSync(filePath);
  
  const { data, error } = await supabase.storage
    .from('products-images')
    .upload(`seed/${filename}`, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg'
    });

  if (error) {
    console.error(`Error uploading ${filename}:`, error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('products-images')
    .getPublicUrl(`seed/${filename}`);
  
  return publicUrl;
}

async function seed() {
  console.log("Uploading images...");
  
  // Upload 8 single category images
  for (const [cat, data] of Object.entries(categories)) {
    console.log(`Uploading ${data.image}...`);
    data.url = await uploadImage(data.image);
  }

  // Upload 10 anillos
  const anillosUrls = [];
  for (const img of anillosImages) {
    console.log(`Uploading ${img}...`);
    anillosUrls.push(await uploadImage(img));
  }

  const products = [];

  // Generate 10 products for each non-ring category
  for (const [cat, data] of Object.entries(categories)) {
    for (let i = 0; i < 10; i++) {
      products.push({
        nombre: `${data.prefix} ${adjectives[i]}`,
        descripcion: `Un diseño único y artesanal de la colección de ${data.prefix}s. Pieza ideal para sumar personalidad a tu look alternativo y sorprender con un estilo diferente. Diseños 100% artesanales.`,
        precio: Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000,
        stock: Math.floor(Math.random() * 20) + 1,
        categoria: cat,
        image_url: data.url
      });
    }
  }

  // Generate 10 rings
  for (let i = 0; i < 10; i++) {
    products.push({
      nombre: `Anillo ${adjectives[i]}`,
      descripcion: `Anillo exclusivo forjado para quienes abrazan la oscuridad. Pieza artesanal que combina tendencias actuales con ese toque único.`,
      precio: Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000,
      stock: Math.floor(Math.random() * 20) + 1,
      categoria: "anillos&midis",
      image_url: anillosUrls[i]
    });
  }

  console.log(`Inserting ${products.length} products...`);
  
  const { data: insertedData, error } = await supabase
    .from('products')
    .insert(products);
    
  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully seeded 90 products!");
  }
}

seed();
