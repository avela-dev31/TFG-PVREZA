require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

require('./config/db');

const productosRoutes = require('./routes/productosRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

// ============================================
// SEGURIDAD — cabeceras HTTP
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // permite servir imágenes al frontend
}));

// ============================================
// CORS — solo acepta el origen del frontend
// ============================================
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origin (Postman, curl) solo en desarrollo
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origen no permitido — ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// PARSEO — limita el tamaño del body (evita ataques DoS)
// ============================================
app.use(express.json({ limit: '10kb' }));

// Archivos estáticos (uploads de imágenes de producto)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// RUTAS
// ============================================
app.use('/api/camisetas', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend PVREZA activo" });
});

// ============================================
// MANEJADOR DE ERRORES GLOBAL
// ============================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // No filtramos detalles internos hacia el cliente
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'Error interno del servidor';
  res.status(status).json({ message });
});

// ============================================
// ARRANQUE
// ============================================
if (process.env.NODE_ENV !== "test") {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;