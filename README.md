# PVREZA CLUB — E-Commerce con Probador Virtual 3D

Trabajo de Fin de Grado — Desarrollo de una tienda online para la marca de streetwear **PVREZA CLUB**, con un probador virtual 3D que permite al usuario visualizar las prendas sobre un avatar ajustado a sus medidas corporales.

## Descripcion del proyecto

PVREZA CLUB es una plataforma e-commerce fullstack que combina la compra de ropa online con una experiencia interactiva de probador virtual en 3D. El usuario puede registrarse con sus medidas (altura y peso), y al entrar en cualquier producto, probar la prenda sobre un modelo tridimensional que se adapta a su cuerpo. La aplicacion incluye gestion completa de pedidos, notificaciones por correo electronico y un panel de administracion.

## Tecnologias

### Frontend
- **React 19** con Vite como bundler
- **React Router v7** para navegacion SPA
- **Three.js** / React Three Fiber / Drei para el probador 3D
- **Axios** para comunicacion con la API
- **Lucide React** para iconografia
- CSS modular con diseño responsive

### Backend
- **Node.js** con Express 5
- **PostgreSQL** (Supabase) como base de datos
- **JWT** para autenticacion
- **bcryptjs** para hash de contraseñas
- **express-rate-limit** + **express-validator** para seguridad
- **CORS** configurado para origenes autorizados

### Infraestructura
- **Vercel** — hosting del frontend (despliegue automatico desde GitHub)
- **Render** — hosting del backend (Node.js)
- **Supabase** — base de datos PostgreSQL en la nube

## Estructura del proyecto

```
PVREZA/
├── frontend/               # Aplicacion React (Vite)
│   ├── src/
│   │   ├── pages/          # Paginas: Home, Catalogo, Producto, Perfil, Login...
│   │   ├── components/     # Navbar, Footer, AvatarCreator, CartDrawer...
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── api/            # Llamadas HTTP (axios)
│   │   ├── styles/         # CSS por componente + responsive
│   │   └── hooks/          # Custom hooks (usePageTitle)
│   └── public/             # Assets estaticos (logo, video, fuentes)
├── backend/                # API REST (Express)
│   ├── controllers/        # Logica de negocio
│   ├── models/             # Queries a PostgreSQL
│   ├── routes/             # Definicion de endpoints
│   ├── middleware/          # Autenticacion JWT (verifyToken, verifyAdmin)
│   ├── services/           # Servicio de email (Nodemailer) (En un futuro)
│   └── uploads/            # Imagenes de productos
├── deploy/                 # Schema SQL para Supabase
└── docs/                   # Diseños (PSD, AI)
```

## Funcionalidades

### Usuario
- Registro con datos biometricos (altura, peso) y vista previa del avatar 3D
- Inicio de sesion con JWT (token valido 7 dias)
- Perfil editable: cambiar nombre, email, altura, peso y contraseña
- Catalogo con buscador, filtros por coleccion y ordenacion por precio
- Carrusel de imagenes en la pagina de producto
- Probador virtual 3D: modelo que se adapta a las medidas del usuario, rotacion 360 grados
- Algoritmo de recomendacion de talla basado en altura y peso
- Lista de favoritos
- Carrito de compra con resumen y checkout
- Historial de pedidos con seguimiento de estado
- Notificacion por email cuando un pedido es aceptado o rechazado (Futuro update)

### Administrador
- Dashboard con metricas: ventas del mes, pedidos activos, stock critico
- Gestion de productos: crear y eliminar
- Gestion de pedidos: aceptar, rechazar, marcar como enviado/entregado
- Visualizacion de datos del comprador (nombre, email) en cada pedido

### Seguridad
- Contraseñas hasheadas con bcrypt (10 salt rounds)
- Autenticacion con JWT y middleware de verificacion
- Rate limiting: maximo 10 intentos de login cada 15 minutos
- Validacion de entrada con express-validator
- Cabeceras HTTP seguras
- CORS restringido a origenes autorizados

## Instalacion local

### Requisitos previos
- Node.js 18+
- PostgreSQL (o cuenta en Supabase)

### Backend
```bash
cd backend
npm install
```

Crear archivo `.env`:
```
DATABASE_URL=postgresql://postgres:root@localhost:5432/TFG-PVREZA
JWT_SECRET=PVREZA_CLUB_Secreto_TFG_2026
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Crear archivo `.env`:
```
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### Base de datos
Ejecutar el script `deploy/supabase-schema.sql` en el SQL Editor de Supabase o en tu instancia local de PostgreSQL.

## Autor

**Antonio Luis Vela Garcia**
Grado Superior en Desarrollo de Aplicaciones Multiplataforma — IES Hermanos Machado, Dos Hermanas (Sevilla)
Curso 2025/2026
