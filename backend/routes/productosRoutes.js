const express = require('express');
const router = express.Router();
const { create, getAll, getById, getVariantes, update, remove, getAllWithStock } = require('../controllers/productosController');
const { verifyAdmin } = require('../middleware/middlewareAuth');

// Rutas públicas
router.get('/', getAll);

// Rutas protegidas (solo admin) — van antes de /:id para evitar colisión
router.get('/admin/stock', verifyAdmin, getAllWithStock);
router.post('/', verifyAdmin, create);

router.get('/:id', getById);
router.get('/:id/variantes', getVariantes);
router.put('/:id', verifyAdmin, update);
router.delete('/:id', verifyAdmin, remove);

module.exports = router;