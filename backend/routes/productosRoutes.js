const express = require('express');
const router = express.Router();
const { getAll, getById, getVariantes, update, remove } = require('../controllers/productosController');
const { verifyAdmin } = require('../middleware/middlewareAuth');

// Rutas públicas
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/variantes', getVariantes);  // ← /api/camisetas/:id/variantes

// Rutas protegidas (solo admin)
router.put('/:id', verifyAdmin, update);
router.delete('/:id', verifyAdmin, remove);

module.exports = router;