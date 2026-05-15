const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, getDashboardStats, updateEstado } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/middlewareAuth');

// Usuario autenticado
router.post('/', verifyToken, createOrder);
router.get('/mis-pedidos', verifyToken, getUserOrders);

// Solo admin
router.get('/todos', verifyAdmin, getAllOrders);
router.get('/dashboard-stats', verifyAdmin, getDashboardStats);
router.put('/:id/estado', verifyAdmin, updateEstado);

module.exports = router;