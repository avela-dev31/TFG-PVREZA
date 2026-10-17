const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/middlewareAuth');
const User = require('../models/User');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Error en GET /me:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/me', verifyToken, [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().normalizeEmail().isEmail().withMessage('Email no válido'),
  body('altura').optional({ nullable: true }).isFloat({ min: 100, max: 250 }),
  body('peso').optional({ nullable: true }).isFloat({ min: 30, max: 300 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre, email, altura, peso } = req.body;

    const existing = await User.findByEmail(email);
    if (existing && existing.id_usuario !== req.user.id) {
      return res.status(409).json({ message: 'Ese email ya está en uso' });
    }

    const updated = await User.update(req.user.id, { nombre, email, altura, peso });
    res.json({ message: 'Perfil actualizado', user: updated });
  } catch (error) {
    console.error('Error en PUT /me:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/me/password', verifyToken, [
  body('currentPassword').notEmpty().withMessage('Contraseña actual obligatoria'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    await User.updatePassword(req.user.id, hashed);
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    console.error('Error en PUT /me/password:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/favoritos', verifyToken, async (req, res) => {
  try {
    const favoritos = await User.getFavoritos(req.user.id);
    res.json(favoritos);
  } catch (error) {
    console.error('Error en GET /favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/favoritos/:idProducto', verifyToken, async (req, res) => {
  try {
    await User.addFavorito(req.user.id, req.params.idProducto);
    res.status(201).json({ message: 'Añadido a favoritos' });
  } catch (error) {
    console.error('Error en POST /favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.delete('/favoritos/:idProducto', verifyToken, async (req, res) => {
  try {
    await User.removeFavorito(req.user.id, req.params.idProducto);
    res.json({ message: 'Eliminado de favoritos' });
  } catch (error) {
    console.error('Error en DELETE /favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;