# 💍 Plataforma E-commerce de Joyería y Accesorios: Delmichi Tienda

Esta es la plataforma completa de E-Commerce para Delmichi, desarrollada utilizando **Next.js (App Router)**, **Supabase** (Base de Datos, Autenticación y Storage) y desplegada en **Cloudflare Pages**. 

Esta aplicación incluye tanto la **tienda pública** como un **Panel de Administración (`/admin`)** privado integrado.

## 🌟 Características Principales

### Para los Clientes (Frontend)
- **Catálogo Dinámico y Filtrado:** Buscador en vivo por coincidencia de nombre y filtros dinámicos por categorías (`Anillos`, `Collares`, etc.).
- **Carrito de Compras Persistente:** Sistema de carrito que guarda su estado localmente utilizando `Zustand`.
- **Autenticación Sencilla:** Registro, inicio de sesión mediante email/contraseña y soporte para **Google OAuth**.
- **Checkout Combinado:** Finalización de compra que envía al cliente a comunicarse vía WhatsApp/Email e internamente **registra la orden automáticamente** en la base de datos de la tienda.
- **Mis Compras (`/perfil/mis-compras`):** Panel para que los clientes registrados vean el estado y el historial de sus pedidos.
- **Páginas Estáticas Ultrarrápidas:** Rutas no dinámicas (Políticas, Contacto, Envíos, Inicio) se prerenderizan estáticamente para máxima velocidad y reducción del tamaño del servidor.

### Para el Administrador (Backend Dashboard en `/admin`)
- **Acceso Protegido por RLS:** Solo usuarios con rol `admin` definido en la tabla `profiles` pueden acceder o modificar datos a través de las APIs protegidas con Row Level Security de PostgreSQL.
- **Gestión de Inventario (CRUD):**
  - **Productos:** Crear, editar (nombre, descripción, precios, categoría y stock), y eliminar productos.
  - **Categorías:** Crear, editar y borrar tags de filtros dinámicos en vivo para el catálogo.
- **Gestor Multimedia (Supabase Storage):**
  - Subida directa de fotos para productos y previsualización de la galería en la nube.
  - Gestión interactiva del carrusel principal de la página de inicio (Hero Gallery).
- **Control de Ventas (Órdenes):**
  - Panel que visualiza en tiempo real los pedidos (fecha, cliente, monto, artículos).
  - Selector dinámico de **Estado de la Orden** (Pendiente, En preparación, Enviado, Completado, Cancelado).
  - Función de borrado masivo de historiales de compras utilizando selectores de checkbox.
- **Ajustes de Tienda Dinámicos:**
  - Panel para actualizar las variables de contacto (WhatsApp, Instagram, Email) sin necesidad de tocar el código fuente, aplicándose instantáneamente en el Footer y los redireccionamientos de compra.

## 🛠 Arquitectura y Stack Tecnológico

- **Frontend:** Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend (BaaS):** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Supabase Storage).
- **Gestión del Estado:** Zustand (para el carrito de compras global).
- **Iconografía:** Lucide React (optimizado).
- **Despliegue (Hosting):** Cloudflare Pages (vía `@cloudflare/next-on-pages`).
- **Control de Versiones y CI/CD:** Git, GitHub Actions.

## 📦 Estructura de la Base de Datos

El sistema funciona sobre 6 tablas principales en PostgreSQL (Supabase):
1. `products`: Inventario y características de cada joya.
2. `categories`: Árbol de categorías disponibles.
3. `hero_images`: Fotografías dinámicas del carrusel de inicio.
4. `orders`: Registro tipo *snapshot* JSON de cada venta.
5. `store_settings`: Variables globales editables (WhatsApp, Email, etc.).
6. `profiles`: Enlace uno-a-uno con `auth.users` que define el `role` del usuario.

## 🚀 Despliegue en Cloudflare Pages

El proyecto ha sido rigurosamente optimizado para cumplir con los límites de Cloudflare Workers (Límite de tamaño de script de 25MB). 
- Las rutas dinámicas necesarias (ej. `admin`, `perfil`) utilizan `export const runtime = 'edge'`.
- El resto de las rutas han sido convertidas a páginas estáticas (removiendo el runtime y utilizando `@supabase/supabase-js` sin uso de cookies en componentes globales como el Footer).

### Comandos Útiles

```bash
# Iniciar el entorno de desarrollo local
npm run dev

# Hacer el build local estándar de Next.js
npm run build

# Compilar simulando el entorno de Cloudflare Edge
npx @cloudflare/next-on-pages
```

Para leer los detalles exactos del diseño y la planificación del sistema, por favor consulte el archivo `Plan_Ecommerce_Joyeria.md` ubicado en la carpeta de documentación.
