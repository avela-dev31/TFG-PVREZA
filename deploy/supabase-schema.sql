-- ============================================
-- PVREZA Club — Schema para Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================

-- Tipos ENUM
CREATE TYPE estado_pedido AS ENUM ('pendiente', 'pagado', 'enviado', 'entregado');
CREATE TYPE talla_tipo AS ENUM ('S', 'M', 'L', 'XL');
CREATE TYPE rol_tipo AS ENUM ('user', 'admin');

-- Usuarios
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  altura DECIMAL(5,2) DEFAULT NULL,
  peso DECIMAL(5,2) DEFAULT NULL,
  edad INT DEFAULT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  rol rol_tipo DEFAULT 'user',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  coleccion VARCHAR(100) DEFAULT NULL,
  imagen_url VARCHAR(255) DEFAULT NULL
);

-- Stock (tallas/colores por producto)
CREATE TABLE stock (
  id_stock SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
  talla talla_tipo NOT NULL,
  color VARCHAR(50) NOT NULL,
  cantidad INT DEFAULT 0,
  url_modelo_3d VARCHAR(255) DEFAULT NULL
);

-- Imágenes de producto
CREATE TABLE imagenes_producto (
  id_imagen SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  orden INT DEFAULT 0
);

-- Pedidos
CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
  total DECIMAL(10,2) NOT NULL,
  estado estado_pedido DEFAULT 'pendiente',
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalles de pedido
CREATE TABLE detalles_pedido (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_stock INT NOT NULL REFERENCES stock(id_stock),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL
);

-- Favoritos
CREATE TABLE favoritos (
  id_favorito SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_usuario, id_producto)
);

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO productos (nombre, descripcion, precio, coleccion, imagen_url) VALUES
('PVREZA CLASSIC TEE', '100% algodón orgánico, 230g. Diseñada en LEBRIJA, SEVILLA.', 28.00, 'DROP GENESIS', '/uploads/productos/classic_tee.jpg'),
('CREATED TO CREATE TEE', '100% algodón orgánico, 230g. Diseñada en LEBRIJA, SEVILLA.', 28.00, 'DROP GENESIS', '/uploads/productos/create_tee.jpg'),
('GXS TEE', '100% algodón orgánico, 230g. Diseñada en LEBRIJA, SEVILLA.', 28.00, 'DROP GENESIS', '/uploads/productos/gxs_tee.jpg');

INSERT INTO stock (id_producto, talla, color, cantidad) VALUES
(1, 'S', 'Negro', 19), (1, 'M', 'Negro', 20), (1, 'L', 'Negro', 20), (1, 'XL', 'Negro', 20),
(2, 'S', 'Negro', 20), (2, 'M', 'Negro', 20), (2, 'L', 'Negro', 20), (2, 'XL', 'Negro', 20),
(3, 'S', 'Negro', 20), (3, 'M', 'Negro', 20), (3, 'L', 'Negro', 20), (3, 'XL', 'Negro', 20);

-- Usuario admin (password: admin123 con bcrypt)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin', 'admin@pvreza.com', '$2b$10$hJjWg6X1gjUtb3vVQX/z6.aSfLctc4jleL1qR8C1RdWgNpIHxwRWW', 'admin');
