# 🕸️ Manual de Gestión: Web Joyería Gótica

Este manual está diseñado para que puedas gestionar tu página web de joyas y accesorios con estética alternativa desde **Obsidian**.

## 📁 Estructura del Proyecto
- `index.html`: La estructura principal de la web.
- `style.css`: Donde vive la "magia" visual (colores, fuentes, sombras).
- `main.js`: Lógica de interactividad.
- `assets/`: Carpeta para tus fotos de joyas.

---

## 🛠️ Cómo agregar nuevos productos
Para agregar una joya nueva, debes buscar en el archivo `index.html` la sección que dice `<!-- INICIO PRODUCTOS -->`. 

Copia y pega este bloque para cada producto nuevo:

```html
<div class="product-card">
    <img src="assets/nombre-de-tu-foto.jpg" alt="Nombre Joya">
    <h3>Nombre de la Joya</h3>
    <p class="price">$0.00</p>
    <button class="buy-btn">Añadir al carrito</button>
</div>
```

> [!TIP]
> Asegúrate de que todas las imágenes tengan el mismo tamaño (recomendado: 800x800px) para que la grilla se vea perfecta.

---

## 🎨 Personalización del Estilo
Si quieres cambiar los colores, abre `style.css`. He configurado variables al principio para que sea fácil:

- `--bg-color`: Fondo (actualmente negro profundo).
- `--accent-color`: Color de realce (actualmente rojo sangre/plata).
- `--text-color`: Color de las letras.

---

## 🚀 Cómo subir la web gratis
Tienes dos opciones principales que funcionan con esta estructura:

1. **GitHub Pages (Recomendado):**
   - Crea un repositorio en GitHub.
   - Sube estos archivos.
   - En *Settings > Pages*, activa el despliegue.
2. **Vercel / Netlify:**
   - Solo arrastra la carpeta del proyecto a sus paneles de control y ¡listo!

---

## 🖤 Notas de Diseño (Estética Metal)
- **Tipografía:** Usamos fuentes con serifas afiladas para títulos y sans-serif limpias para el cuerpo.
- **Espaciado:** Mucho espacio en blanco (o negro) para que las joyas resalten como piezas de arte.
- **Bordes:** Bordes finos color plata (`#c0c0c0`) para simular metal.
