const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController');
const { verifyToken } = require('../middleware/middlewareAuth');

router.post('/create-checkout-session', verifyToken, createCheckoutSession);

module.exports = router;
