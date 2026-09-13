---
tags:
  - proyecto
  - ecommerce
  - joyeria
  - alternativa
  - gotica
fecha: 2026-09-11
estado: en_desarrollo
---

# 💍 Plataforma E-commerce de Joyería y Accesorios: Delmichi Tienda

**Idea y Objetivo del Proyecto:**
Desarrollar una tienda en línea completa para la venta de joyería, bisutería de autor y accesorios con una identidad **urbana, atrevida, alternativa, gótica y artesanal** (chokers, collares, anillos, pulseras).
La plataforma permitirá a los clientes explorar el catálogo con filtros avanzados, registrarse (incluyendo login con Google), añadir productos al carrito, comprar con pasarela de pago segura y revisar su historial en **"Mis Compras"**.
Incluye un **Panel de Administración Privado (`/admin`)** para que el administrador pueda subir y gestionar fotos en Supabase Storage, crear, editar precios, descripciones y stock, y administrar pedidos.

---

## 🎨 Identidad Visual y Estética de Diseño

- **Personalidad de Marca:** Urbana, alternativa, gótica romántica y artesanal.
- **Paleta de Colores:**
  - **Fondo General:** Violeta / Morado profundo oscuro (Gothic Dark Purple, ej. `#09040e` / `#130924`).
  - **Color Principal / Estructura:** Negro profundo y carbón (ej. `#000000`, `#121212`) con bordes sutiles en tonos lavanda/violeta oscuro.
  - **Color de Acento / Botones (CTA):** Violeta eléctrico / púrpura vibrante (ej. `#8b5cf6`, `#a855f7`) con efectos de resplandor (glow) al interactuar.
- **Tipografía:**
  - **Títulos y Logo:** Estilo "Romance" / Gótico elegante con serifa (ej. *Cinzel*, *Playfair Display* o *Cinzel Decorative* de Google Fonts).
  - **Textos y Descripciones:** Fuente moderna, limpia y de máxima legibilidad (ej. *Inter* o *Geist*).
- **Tarjetas de Producto (Product Cards):**
  - **Bordes:** Cuadrados (bordes rectos / sin redondeo pronunciado, estética filosa y atrevida).
  - **Animaciones e Interacciones:**
    - Al pasar el cursor (*hover*): La tarjeta se eleva ligeramente con sombra violeta profunda.
    - Zoom suave en la imagen.
    - Acciones rápidas: Visualización de precio, descripción breve y botón directo de compra / agregar al carrito.
- **Navegación (Navbar):**
  - **Sticky Navbar:** Se mantiene fija en la parte superior al hacer scroll.
  - **Menú y Categorías:** Inicio, Chokers & Collares, Anillos, Pulseras, Accesorios, Contacto, Carrito y botón de Perfil/Login.

---

## 🛠 Herramientas y Stack Tecnológico

1. **Frontend:** Next.js (App Router, React, TypeScript), Tailwind CSS.
2. **Backend & Base de Datos:** Supabase (PostgreSQL, Row Level Security, Auth con Email y Google OAuth, Supabase Storage para fotos).
3. **Pagos:** MercadoPago / Stripe (sin costo fijo mensual, comisión por venta).
4. **Hosting:** Cloudflare Pages ($0 costo fijo, permite uso comercial y tráfico ilimitado).
5. **Dominio:** Enlace provisional gratuito de Cloudflare para desarrollo, con posterior vinculación de dominio propio (`.com`).

---

## 🔄 Flujo de Trabajo y Despliegue Automático (CI/CD)

El proyecto cuenta con un entorno de integración y despliegue continuo completamente automatizado mediante **GitHub Actions**. Para evitar errores y mantener la sincronización, **todas las modificaciones se realizan de forma local a través de código y comandos CLI, nunca desde los paneles web (Cloudflare/Supabase)**.

**El flujo es el siguiente:**
1. **Petición del usuario:** Solicita un cambio visual o de backend al asistente inteligente.
2. **Desarrollo Local:**
   - *Cambios Visuales (Frontend):* Se modifican los archivos de Next.js (React/Tailwind) en el directorio `tienda/`.
   - *Cambios Base de Datos (Backend):* Se genera una nueva migración SQL utilizando el CLI de Supabase (`npx supabase migration new <nombre>`). El código SQL va dentro de `tienda/supabase/migrations/`.
3. **Commit y Push a GitHub:** Una vez que el código local funciona, se suben los cambios al repositorio privado (`git commit && git push`).
4. **Automatización en la Nube:**
   - **Frontend:** Cloudflare Pages detecta el push en `main` y redespliega la web automáticamente en el dominio `delmichi.pages.dev`.
   - **Backend:** GitHub Actions ejecuta el workflow `supabase.yml` que corre los nuevos archivos de migración contra la base de datos productiva de Supabase, manteniendo los esquemas y políticas siempre actualizados.

---

## 🔐 Gestión de Usuarios y Roles

### 1. Clientes (Público)
- Navegación libre y compra.
- Inicio de sesión con correo o **Google OAuth (1 clic)**.
- **Sección "Mis Compras":** Historial de pedidos realizados con fecha, estado del envío y detalle de productos.

### 2. Administrador (Backoffice `/admin`)
- Acceso restringido por credenciales/rol de administrador.
- **Gestión Multimedia:** Subida directa, previsualización y eliminación de fotografías de joyas hacia el bucket de Supabase Storage.
- **CRUD de Catálogo:** Crear nuevos artículos, modificar precios, actualizar stock y editar descripciones.
- **Gestión de Envíos:** Panel de órdenes para actualizar estados (Pendiente, Pagado, En Preparación, Enviado, Entregado).

---

## 🗺 Roadmap de Implementación por Etapas

### Etapa 1: Configuración del Backend (Supabase) [COMPLETADA]
- [x] **Tarea 1.1:** Crear proyecto en Supabase (Delmichi Tienda) y guardar credenciales en `supabase_credentials.md` y `.env.local`.
- [x] **Tarea 1.2:** Crear tabla `products` y tabla `orders` en `schema.sql`.
- [x] **Tarea 1.3:** Configurar bucket `products-images` en Supabase Storage.
- [x] **Tarea 1.4:** Activar RLS (Row Level Security) para seguridad de lectura pública y escritura restringida.
- [x] **Tarea 1.5:** Instalar `@supabase/supabase-js`, configurar `supabaseClient.ts` y tipos en `database.ts`.

### Etapa 2: UI Base, Tema Gótico/Alternativo y Componentes Globales [COMPLETADA]
- [x] **Tarea 2.1:** Configurar tema oscuro violeta/negro y tipografía gótica romántica en `tailwind.config.ts` y `globals.css`.
- [x] **Tarea 2.2:** Desarrollar `Navbar` sticky con logo, menú de categorías (Chokers, Collares, Anillos, Pulseras), carrito y acceso de usuario.
- [x] **Tarea 2.3:** Desarrollar `Footer` con estilo alternativo, enlaces a redes sociales (Instagram, TikTok, WhatsApp) y políticas.
- [x] **Tarea 2.4:** Crear componente `ProductCard` cuadrado con animación de elevación, resplandor violeta y zoom de foto en hover.

### Etapa 3: Páginas Principales y Catálogo con Filtros [COMPLETADA]
- [x] **Tarea 3.1:** Crear página de Inicio (`/`) con Hero Section ("Joyas y accesorios"), banners promocionales y sección de Destacados conectada a BD.
- [x] **Tarea 3.2:** Crear página de Catálogo (`/catalogo`) con barra lateral de filtros (categoría, precio, orden).
- [x] **Tarea 3.3:** Conectar Catálogo con Supabase y aplicar filtros mediante `searchParams`.
- [x] **Tarea 3.4:** Crear vista dinámica de Detalle de Producto (`/producto/[id]`) con validación de stock y selector de cantidad.

### Etapa 4: Carrito de Compras y Autenticación de Clientes (Google + "Mis Compras") [COMPLETADA]
- [x] **Tarea 4.1:** Estado global del Carrito (Zustand) con control de stock y persistencia en localStorage (`useCart.ts`).
- [x] **Tarea 4.2:** Vista completa de Carrito (`/carrito`) con control de cantidades, eliminación y resumen de compra.
- [x] **Tarea 4.3:** Integración de Supabase Auth (Email, Contraseña y Google OAuth con `/auth/callback`) para clientes.
- [x] **Tarea 4.4:** Crear página protegida del cliente `/perfil/mis-compras` para consultar el historial de órdenes y acceso según rol.

### Etapa 5: Checkout y Pasarela de Pagos Diferida [COMPLETADA]
- [x] **Tarea 5.1:** Formulario de envío y carrito lateral (`/carrito`).
- [x] **Tarea 5.2:** Integración dinámica para finalizar compra redirigiendo a WhatsApp y Gmail pre-formateado.
- [x] **Tarea 5.3:** Asentamiento automático de la orden en la base de datos de Supabase en el momento que se hace clic en Checkout.

### Etapa 6: Panel de Administración Privado (`/admin`) [COMPLETADA]
- [x] **Tarea 6.1:** Autenticación exclusiva para rol administrador en `/admin` mediante consulta a `profiles`.
- [x] **Tarea 6.2:** Dashboard con listado de productos, control rápido de stock, precios y gestión de portada (`hero_gallery`).
- [x] **Tarea 6.3:** Formulario modal de creación y edición directa de productos en Supabase.
- [x] **Tarea 6.4:** Subida directa de archivos y gestión de biblioteca visual (Storage) para evitar duplicados.
- [x] **Tarea 6.5:** Pestaña "Ventas" con historial de órdenes, selector dinámico de estado de envío (Pendiente, Vendido, Completado, Cancelado) y eliminación masiva.
- [x] **Tarea 6.6:** Pestaña "Categorías" para administrar de forma dinámica los filtros del catálogo web.
- [x] **Tarea 6.7:** Pestaña "Ajustes" para edición en vivo del número de contacto, Instagram y correo del Footer.

---

## 📱 Textos e Inspiración (Instagram)

Textos extraídos para uso en la web y redes:
- "Tenemos de todo para vos!"
- "Ya saben! Siempre encontrarán algo nuevo 😁"
- "Buscas cruces? Tenemos de todos los tamaños !"
- "Únicos modelos!"
- "Hagan sus pedidos personalizados!"
- "Cada diseño combina tendencias actuales con ese toque único que hace que cada pieza sea especial, ideal para fans que quieren sumar personalidad a su look o sorprender con un regalo diferente."
- "Diseños 100% artesanales"

---

## 📖 Documentación Detallada del Sistema Construido (Para Futura Referencia)

Para asegurar que todo el progreso y las características técnicas del desarrollo queden asentados de forma permanente tras cerrar este entorno, a continuación se detallan todas las funcionalidades implementadas hasta la fecha en la aplicación web:

### 1. Panel de Administración (`/admin`)
El corazón del proyecto. Un dashboard protegido, accesible únicamente si la base de datos detecta que el usuario tiene el rol `admin` en la tabla `profiles`. Cuenta con 6 pestañas principales que gobiernan toda la web:
- **Gestión de Productos:** Permite crear, editar (nombre, precio, foto principal) y eliminar productos. Las fotos se suben directamente al bucket `productos` y el URL público se enlaza al artículo.
- **Categorías:** Un sistema donde el admin crea "Tags" (ej. Anillos, Aros, Collares). Si una categoría se modifica o borra aquí, los filtros de la tienda en toda la web se adaptan al instante, y los productos sin categoría se ocultan temporalmente.
- **Galería Principal (Hero):** Permite cambiar las imágenes del carrusel interactivo que aparece en la pantalla principal (`/`). Las fotos pueden activarse o desactivarse en un solo clic.
- **Archivos (Storage):** Una biblioteca visual interna de todas las fotos subidas a Supabase Storage. El admin puede reutilizar enlaces (URLs) para evitar subidas duplicadas o borrar definitivamente la basura para no consumir espacio en la nube.
- **Registro de Ventas:** Una tabla analítica de los pedidos realizados, generados automáticamente en el momento del checkout de un cliente. 
  - Muestra una foto estática de la compra: Fecha, nombre del artículo comprado, cliente, cantidad total y precio total. (Esto evita errores si luego el admin borra el producto original de la tienda).
  - Incluye un **menú desplegable dinámico** para cambiar en vivo el estado de preparación (Pendiente, Vendido, Completado, Cancelado).
  - Incluye selección múltiple por casilleros (checkbox) para borrar masivamente historiales antiguos.
- **Ajustes:** Edición en vivo de los datos de contacto de la tienda (Número de WhatsApp, Usuario de Instagram, Correo Público). La página lee y escribe directamente en la base de datos, por lo que el *Footer* (pie de página) de toda la web se actualiza al segundo.

### 2. Catálogo Público (`/productos`)
- **Buscador Funcional (Search):** Una barra de búsqueda en el menú superior que busca coincidencias ILIKE en los nombres de todos los productos de la tienda y redirige a la vista filtrada.
- **Filtros por Categoría:** Extraídos de la tabla de categorías para evitar menús rotos o desactualizados.
- **Ordenamiento Cliente/Servidor:** Un filtro desplegable flotante arriba de la grilla que ordena el inventario entero por "Precio: Menor/Mayor", "Alfabético: A-Z/Z-A" y "Más Recientes".

### 3. Sistema de Compras y Carrito
- **Carrito Persistente con Zustand:** Los usuarios pueden añadir productos y gestionar cantidades sin perder los datos al recargar la página (almacenado en caché / localstorage).
- **Checkout Combinado (Web/WhatsApp/Gmail):** 
  1. Al darle clic a finalizar la compra, el código JavaScript recorre el carrito, suma los totales, prepara un mensaje de texto amigable ("Hola, quisiera hacer este pedido...") y abre WhatsApp Web o Gmail.
  2. Al *mismo milisegundo*, la tienda inyecta un registro silencioso en la tabla `orders` de Supabase con los datos del usuario y los ítems elegidos en formato JSON, para que el administrador lo vea reflejado en la pestaña de "Ventas" automáticamente sin tener que esperar que el cliente mande el WhatsApp.

### 4. Base de Datos (Estructura Supabase)
El proyecto utiliza estas tablas principales bajo PostgreSQL:
- `products`: Catálogo de ítems (ID, nombre, precio, categoría, URL de imagen).
- `categories`: Taxonomía (ID, nombre, slug).
- `hero_images`: Imágenes de portada (URL, orden, activa).
- `orders`: Histórico (Snapshot JSON de la venta, Total, Email del cliente, Dirección/Nombre, Estado).
- `store_settings`: Metadatos Key-Value con restricción UNIQUE (`email`, `whatsapp`, `instagram`).
- `profiles`: Creada por un trigger en Auth de Supabase, guarda el ID del usuario y si su `role` es `admin`.

### 5. Reglas RLS (Seguridad a Nivel de Fila)
Todas las tablas cuentan con políticas de seguridad integradas (RLS con `WITH CHECK` y `USING`) que bloquean ciberataques y previenen alteraciones desde la consola del navegador:
- Todo el público puede usar el comando `SELECT` en productos, categorías e imágenes, y puede hacer `INSERT` únicamente en la tabla de ventas (pero no modificar ni borrar ventas ajenas).
- Solo las cuentas donde `role = 'admin'` tienen permisos de `INSERT`, `UPDATE` y `DELETE` para cambiar configuraciones de la tienda, productos, fotos y eliminar o editar el estado de las órdenes.

### 6. Optimizaciones de Despliegue (Cloudflare) y UI Responsiva
- **Optimización de Bundle (Límite 25MB):** Para evitar fallos en el despliegue de Cloudflare Pages (límite de memoria en Edge Functions), se eliminó `export const runtime = 'edge'` de las páginas estáticas (Inicio, Contactos, Términos) y se optimizó la importación de iconos (`lucide-react`) en el `next.config.ts`.
- **Componentes Estáticos:** Se refactorizó el `Footer` y la página de Contactos para que utilicen un cliente estándar de `supabase-js` (sin lectura de cookies), permitiendo que Next.js los pre-renderice como HTML estático, ahorrando espacio en el servidor.
- **Grilla Móvil de 3 Columnas:** Se actualizó el diseño responsivo de las grillas de productos en Inicio, Catálogo y Perfil para forzar 3 columnas en pantallas móviles (`grid-cols-3`). Se reescaló la tipografía, iconos y el relleno (padding) de las tarjetas (`ProductCard`) para que se ajusten estéticamente a espacios reducidos sin romperse.
- **Tipado Estricto (TypeScript):** Se corrigieron todos los errores estrictos de tipado que interferían con el *build* (propiedades faltantes en inserciones al carrito como `destacado` y casteo explícito de datos dinámicos provenientes de la base de datos).

