'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchHeroes = async () => {
      const { data } = await supabase.from('hero_gallery').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) {
        setHeroImages(data.map(h => h.image_url))
      } else {
        setHeroImages([])
      }
    }
    fetchHeroes()
  }, [])

  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Cambia cada 5 segundos
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden border-b border-border-violet">
      {/* Background Images */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09040e] via-transparent to-transparent z-10"></div>
          <Image
            src={src}
            alt="Hero background"
            fill
            className="object-cover object-center transform scale-105"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <span className="text-accent-violet text-xs md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6 animate-pulse">
          VARIEDAD EN DISEÑOS
        </span>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          Estilo y <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-[#d8b4fe]">Elegancia</span>
        </h1>
        <p className="max-w-lg mx-auto text-zinc-300 mb-8 md:mb-10 text-sm md:text-lg drop-shadow-md">
          Tenemos de todo para vos, modelos unicos y diseños personalizados para sumar personalidad a su look o sorprender con un regalo diferente.
        </p>
        <Link 
          href="/productos" 
          className="inline-block bg-accent-violet hover:bg-white hover:text-black text-white font-medium px-8 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm transition-all duration-300 shadow-glow"
        >
          EXPLORAR PRODUCTOS
        </Link>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-accent-violet scale-125 shadow-glow' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
