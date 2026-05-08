const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

// ============================================
// RATE LIMITING — máximo 10 intentos por IP cada 15 minutos
// ============================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.' },
});

// ============================================
// VALIDACIONES
// ============================================
const registerValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Nombre demasiado largo'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Email no válido'),
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número'),
  body('altura')
    .optional()
    .isFloat({ min: 100, max: 250 }).withMessage('Altura inválida (100-250 cm)'),
  body('peso')
    .optional()
    .isFloat({ min: 30, max: 300 }).withMessage('Peso inválido (30-300 kg)'),
  body('edad')
    .optional()
    .isInt({ min: 16, max: 120 }).withMessage('Edad inválida'),
];

const loginValidation = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Email no válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

// ============================================
// RUTAS
// ============================================
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

module.exports = router;