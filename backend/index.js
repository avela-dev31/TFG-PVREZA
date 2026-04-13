// ============================================
// IMPORTACIONES
// ============================================
require("dotenv").config(); // Vital para que lea tu archivo .env
const express = require("express");
const path = require("path");
const cors = require("cors");
// const { logMensaje } = require("./utils/logger.js"); // Descomenta esto si tienes el archivo creado

// Conectar a la base de datos (¡Imprescindible para el catálogo!)
require('./config/db');

// Importar rutas de la API
const productosRoutes = require('./routes/productosRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');


// ============================================
// INICIALIZACIÓN
// ============================================
const app = express(); // ¡Aquí nace app! A partir de aquí ya podemos usarla
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(cors()); // Permite conexiones desde tu app móvil (React Native) y web
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// RUTAS
// ============================================
// (Las asignamos SOLO UNA VEZ, ahora que la app ya existe)
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Ruta base para comprobar que el backend respira
app.get("/", (req, res) => {
    res.send("Backend de PVREZA funcionando correctamente en Docker 🚀");
});

// ============================================
// ARRANCAR SERVIDOR
// ============================================
if (process.env.NODE_ENV !== "test") {
    app.listen(port, '0.0.0.0', () => { 
        console.log(`🚀 Servidor escuchando en el puerto ${port}`);
        console.log(`📱 Accesible desde la red local para React Native`);
        // if (logMensaje) logMensaje(`Servidor iniciado en puerto ${port}`);
    });
}

// Exportamos para los tests
module.exports = app;