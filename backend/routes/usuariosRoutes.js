// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();

// GET /api/users/:id/bio -> Obtener altura y peso para el avatar 3D
router.get('/:id/bio', (req, res) => {
    res.json({ mensaje: `Obteniendo biometría del usuario ${req.params.id}` });
});

module.exports = router;