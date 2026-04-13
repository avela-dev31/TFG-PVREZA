const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// GET /api/productos -> Devuelve todas las camisetas de PVREZA
router.get('/', productosController.obtenerProductos);

// GET /api/productos/:id -> Devuelve una camiseta específica (ej: /api/productos/1)
router.get('/:id', productosController.obtenerProductoPorId);

// GET /api/productos/:id/stock -> Devuelve las tallas y colores de una camiseta
router.get('/:id/stock', productosController.obtenerStockPorProducto);

module.exports = router;