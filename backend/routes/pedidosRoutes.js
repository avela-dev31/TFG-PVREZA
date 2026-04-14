const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/middlewareAuth');

// Usuario autenticado
router.post('/', verifyToken, createOrder);
router.get('/mis-pedidos', verifyToken, getUserOrders);

// Solo admin
router.get('/todos', verifyAdmin, getAllOrders);

module.exports = router;