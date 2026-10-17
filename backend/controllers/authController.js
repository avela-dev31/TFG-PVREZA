const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password, altura, peso, edad, avatar_url } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserId = await User.create({
      nombre,
      email,
      password: hashedPassword,
      altura,
      peso,
      edad,
      avatar_url
    });

    const token = jwt.sign(
      { id: newUserId, email, rol: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendWelcome(email, nombre).catch(err =>
      console.error('Error enviando email de bienvenida:', err)
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUserId,
        nombre,
        email,
        rol: 'user',
        avatar_url
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login correcto',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        altura: user.altura,
        peso: user.peso,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const crypto = require('crypto');
const { sendPasswordReset, sendWelcome } = require('../services/emailService');

const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await User.saveResetToken(user.id_usuario, token, expires);

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0];
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    sendPasswordReset(email, user.nombre, resetUrl).catch(err =>
      console.error('Error enviando email de reset:', err)
    );

    res.status(200).json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, password } = req.body;

  try {
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'El enlace ha expirado o no es válido' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(user.id_usuario, hashedPassword);
    await User.clearResetToken(user.id_usuario);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
