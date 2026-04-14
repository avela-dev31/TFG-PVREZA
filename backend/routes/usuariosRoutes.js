const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/middlewareAuth');

// GET /api/users/:id/bio -> Obtener altura y peso para el avatar 3D
router.get('/:id/bio', verifyToken, (req, res) => {
  res.json({ mensaje: `Obteniendo biometría del usuario ${req.params.id}` });
});

module.exports = router;