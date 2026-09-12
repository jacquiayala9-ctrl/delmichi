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
('/images/SaveClip.App_684160361_18049979897737922_8246329311619868512_n.jpg'),
('/images/SaveClip.App_702213027_18052344710737922_3146305999706382924_n.jpg'),
('/images/SaveClip.App_719031802_18055310507737922_6691498439370714377_n.jpg'),
('/images/SaveClip.App_721340070_18055656758737922_6422465724470470980_n.jpg');
