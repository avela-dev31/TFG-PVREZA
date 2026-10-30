const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden activar 2FA' });
    }

    if (user.totp_enabled) {
      return res.status(400).json({ message: '2FA ya está activado en esta cuenta' });
    }

    const secret = speakeasy.generateSecret({
      name: `PVREZA Admin (${user.email})`,
      issuer: 'PVREZA Club',
      length: 32,
    });

    await User.saveTotpSecret(user.id_usuario, secret.base32);

    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrDataUrl,
    });
  } catch (error) {
    console.error('Error en setup2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const verifySetup2FA = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Código requerido' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.totp_secret) {
      return res.status(400).json({ message: 'Primero debes iniciar la configuración de 2FA' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Código incorrecto. Inténtalo de nuevo.' });
    }

    await User.enableTotp(user.id_usuario);

    res.json({ message: '2FA activado correctamente' });
  } catch (error) {
    console.error('Error en verifySetup2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const verify2FA = async (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ message: 'Token temporal y código requeridos' });
  }

  try {
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Token temporal inválido o expirado' });
    }

    if (decoded.type !== '2fa_pending') {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.totp_secret) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Código incorrecto' });
    }

    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login correcto',
      token,
      refreshToken,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        altura: user.altura,
        peso: user.peso,
      },
    });
  } catch (error) {
    console.error('Error en verify2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const disable2FA = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Código requerido para desactivar 2FA' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.totp_enabled) {
      return res.status(400).json({ message: '2FA no está activado' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Código incorrecto' });
    }

    await User.disableTotp(user.id_usuario);

    res.json({ message: '2FA desactivado correctamente' });
  } catch (error) {
    console.error('Error en disable2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const status2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ enabled: !!user?.totp_enabled });
  } catch (error) {
    console.error('Error en status2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { setup2FA, verifySetup2FA, verify2FA, disable2FA, status2FA };
