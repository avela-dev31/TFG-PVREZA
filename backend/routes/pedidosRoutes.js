// routes/pedidos.routes.js
const express = require('express');
const router = express.Router();

// POST /api/pedidos -> Generar un nuevo pedido
router.post('/', (req, res) => {
    res.json({ mensaje: 'Ruta para crear pedido preparada' });
});

// GET /api/pedidos -> Ver historial de pedidos
router.get('/', (req, res) => {
    res.json({ mensaje: 'Historial de pedidos del usuario' });
});

module.exports = router;