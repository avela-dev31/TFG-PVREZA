const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Reserva = require('../models/Reserva');
const { sendReservaConfirmation } = require('../services/emailService');

const reservaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
});

const MAX_RESERVAS = 10;

router.post(
  '/',
  reservaLimiter,
  [
    body('email').trim().normalizeEmail().isEmail().withMessage('Email no válido'),
    body('coleccion').trim().notEmpty().withMessage('Colección requerida'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, coleccion } = req.body;

    try {
      const total = await Reserva.countByColeccion(coleccion);
      if (total >= MAX_RESERVAS) {
        return res.status(409).json({ message: 'Se han agotado las plazas de reserva para esta colección' });
      }

      const reserva = await Reserva.create(email, coleccion);
      if (!reserva) {
        return res.status(409).json({ message: 'Ya tienes una reserva para esta colección' });
      }

      const posicion = total + 1;

      sendReservaConfirmation(email, coleccion, posicion).catch(err =>
        console.error('Error enviando email de reserva:', err)
      );

      res.status(201).json({ message: 'Reserva confirmada', posicion });
    } catch (error) {
      console.error('Error en reserva:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

router.get('/:coleccion/plazas', async (req, res) => {
  try {
    const total = await Reserva.countByColeccion(req.params.coleccion);
    res.json({ total, disponibles: Math.max(0, MAX_RESERVAS - total) });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
