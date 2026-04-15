const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const { items } = req.body;
  // items = [{ id_stock, cantidad, precio_unitario }, ...]
  const id_usuario = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío' });
  }

  try {
    // 1. Verificar stock de cada item
    for (const item of items) {
      const stockData = await Order.checkStock(item.id_stock);
      if (!stockData || stockData.cantidad < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto con id_stock ${item.id_stock}`
        });
      }
    }

    // 2. Calcular total
    const total = items.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0);

    // 3. Crear el pedido
    const id_pedido = await Order.create(id_usuario, total);

    // 4. Insertar detalles y descontar stock
    for (const item of items) {
      await Order.addDetail(id_pedido, item.id_stock, item.cantidad, item.precio_unitario);
      await Order.decreaseStock(item.id_stock, item.cantidad);
    }

    res.status(201).json({
      message: 'Pedido creado correctamente',
      id_pedido,
      total
    });

  } catch (error) {
    console.error('Error en createOrder:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const pedidos = await Order.getByUser(req.user.id);
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error en getUserOrders:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const pedidos = await Order.getAll();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error en getAllOrders:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders };