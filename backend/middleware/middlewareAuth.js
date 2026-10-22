const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('./tokenBlacklist');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado: token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  if (isBlacklisted(token)) {
    return res.status(401).json({ message: 'Sesión cerrada. Vuelve a iniciar sesión.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };