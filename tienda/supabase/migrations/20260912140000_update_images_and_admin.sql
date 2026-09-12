-- 1. Eliminar imágenes genéricas e insertar las de SaveClip
DELETE FROM public.hero_gallery;

INSERT INTO public.hero_gallery (image_url) VALUES 
('/images/SaveClip.App_684160361_18049979897737922_8246329311619868512_n.jpg'),
('/images/SaveClip.App_702213027_18052344710737922_3146305999706382924_n.jpg'),
('/images/SaveClip.App_719031802_18055310507737922_6691498439370714377_n.jpg'),
('/images/SaveClip.App_721340070_18055656758737922_6422465724470470980_n.jpg');

-- 2. Modificar el Trigger de creación de usuario para que asigne rol de admin al email específico
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el email es el de la dueña, asignarle rol de admin
  IF new.email = 'jacquiayala9@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'cliente')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ascender a 'admin' si ya se había registrado con anterioridad (para evitar que se quede estancada como cliente)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'jacquiayala9@gmail.com';
