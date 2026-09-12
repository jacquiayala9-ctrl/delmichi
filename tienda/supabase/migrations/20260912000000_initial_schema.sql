-- Habilitar extensión para generar UUIDs (por defecto ya suele estar, pero es buena práctica)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Creación de la tabla products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  categoria TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Creación de la tabla orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_email TEXT,
  total NUMERIC,
  estado TEXT DEFAULT 'pendiente',
  direccion_envio JSONB,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security (RLS) en ambas tablas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Asignar permisos básicos para que las políticas RLS tomen el control
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Políticas para 'products'
-- Permitir lectura pública de productos
CREATE POLICY "Lectura pública de productos"
  ON public.products
  FOR SELECT
  USING (true);

-- Permitir inserción, actualización y eliminación de productos solo a usuarios autenticados
-- Asumiendo que los administradores usarán roles autenticados de Supabase Auth
CREATE POLICY "Gestión de productos para usuarios autenticados"
  ON public.products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para 'orders'
-- Permitir creación de órdenes a cualquier usuario (público / cliente)
CREATE POLICY "Creación de órdenes pública"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Permitir lectura de órdenes solo a administradores (usuarios autenticados)
-- (Si se requiere que el usuario vea su propia orden, se debería ajustar comprobando el auth.uid() u otro token)
CREATE POLICY "Lectura de órdenes solo administradores"
  ON public.orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Permitir actualización de órdenes a administradores (usuarios autenticados)
CREATE POLICY "Actualización de órdenes solo administradores"
  ON public.orders
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------
-- Storage Bucket: products-images
-- --------------------------------------------------------
-- Inserta el bucket en la tabla de almacenamiento de Supabase (schema storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products-images', 'products-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket 'products-images'
-- Permitir lectura pública de imágenes
CREATE POLICY "Lectura pública de imágenes de productos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products-images');

-- Permitir a usuarios autenticados subir/gestionar imágenes
CREATE POLICY "Gestión de imágenes de productos para administradores"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'products-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'products-images' AND auth.role() = 'authenticated');
-- Create hero_gallery table
CREATE TABLE public.hero_gallery (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hero_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.hero_gallery FOR SELECT 
USING ( true );

-- Allow admins full access
CREATE POLICY "Admins can insert hero_gallery" 
ON public.hero_gallery FOR INSERT 
WITH CHECK ( 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update hero_gallery" 
ON public.hero_gallery FOR UPDATE 
USING ( 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete hero_gallery" 
ON public.hero_gallery FOR DELETE 
USING ( 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert initial images
INSERT INTO public.hero_gallery (image_url) VALUES 
('/images/anillonegro.jpg'),
('/images/calaveras.jpg'),
('/images/palos.jpg');

-- --------------------------------------------------------
-- Tabla profiles (Gestión de roles de usuarios y administradores)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'cliente',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de perfiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger automático para crear perfil cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'cliente')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


