const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { verifyAdmin } = require('../middleware/middlewareAuth');
const { setup2FA, verifySetup2FA, verify2FA, disable2FA, status2FA } = require('../controllers/twoFactorController');

const twoFaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
});

router.post('/setup', verifyAdmin, setup2FA);
router.post('/verify-setup', verifyAdmin, verifySetup2FA);
router.post('/verify', twoFaLimiter, verify2FA);
router.post('/disable', verifyAdmin, disable2FA);
router.get('/status', verifyAdmin, status2FA);

module.exports = router;
