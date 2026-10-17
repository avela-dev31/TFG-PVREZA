const Order = require('../models/Order');
const { sendOrderAccepted, sendOrderRejected } = require('../services/emailService');

const createOrder = async (req, res) => {
  const { items } = req.body;
  const id_usuario = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío' });
  }

  try {
    const itemsVerificados = [];
    for (const item of items) {
      const stockData = await Order.checkStock(item.id_stock);
      if (!stockData || stockData.cantidad < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto con id_stock ${item.id_stock}`
        });
      }
      itemsVerificados.push({
        id_stock: item.id_stock,
        cantidad: item.cantidad,
        precio_unitario: stockData.precio
      });
    }

    const total = itemsVerificados.reduce(
      (sum, item) => sum + Number(item.precio_unitario) * item.cantidad, 0
    );

    const id_pedido = await Order.create(id_usuario, total);

    for (const item of itemsVerificados) {
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

const getDashboardStats = async (req, res) => {
  try {
    const [ventasMes, pedidosActivos, stockCritico] = await Promise.all([
      Order.getMonthSales(),
      Order.getActiveOrdersCount(),
      Order.getCriticalStockCount()
    ]);

    res.status(200).json({
      ventas_mes: ventasMes,
      pedidos_activos: pedidosActivos,
      stock_critico: stockCritico
    });
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['pendiente', 'pagado', 'enviado', 'entregado', 'rechazado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado no válido' });
  }

  try {
    const orderData = await Order.getOrderWithUser(id);
    if (!orderData) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const pedido = await Order.updateEstado(id, estado);

    if (estado === 'pagado') {
      const detalles = await Order.getOrderDetails(id);
      sendOrderAccepted(orderData.email, orderData.nombre_usuario, pedido, detalles)
        .catch(err => console.error('Error enviando email de aceptación:', err));
    }

    if (estado === 'rechazado') {
      await Order.restoreStock(id);
      sendOrderRejected(orderData.email, orderData.nombre_usuario, pedido)
        .catch(err => console.error('Error enviando email de rechazo:', err));
    }

    res.json({ message: `Pedido #${id} actualizado a "${estado}"`, pedido });
  } catch (error) {
    console.error('Error en updateEstado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, getDashboardStats, updateEstado };