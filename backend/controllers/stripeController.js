const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { sendOrderAccepted } = require('../services/emailService');

const createCheckoutSession = async (req, res) => {
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
          message: `Stock insuficiente para "${stockData?.nombre || 'producto'}" (talla ${stockData?.talla || '?'})`
        });
      }
      itemsVerificados.push({
        id_stock: item.id_stock,
        cantidad: item.cantidad,
        precio_unitario: stockData.precio,
        nombre: stockData.nombre,
        talla: stockData.talla,
      });
    }

    const total = itemsVerificados.reduce(
      (sum, item) => sum + Number(item.precio_unitario) * item.cantidad, 0
    );

    const id_pedido = await Order.create(id_usuario, total);
    for (const item of itemsVerificados) {
      await Order.addDetail(id_pedido, item.id_stock, item.cantidad, item.precio_unitario);
    }

    const line_items = itemsVerificados.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.nombre} — Talla ${item.talla}`,
        },
        unit_amount: Math.round(Number(item.precio_unitario) * 100),
      },
      quantity: item.cantidad,
    }));

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
      metadata: { id_pedido: String(id_pedido) },
    });

    await Order.setStripeSession(id_pedido, session.id);

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error en createCheckoutSession:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const id_pedido = session.metadata.id_pedido;

    try {
      await Order.decreaseStockForOrder(id_pedido);
      const pedido = await Order.updateEstado(id_pedido, 'pagado');

      const orderData = await Order.getOrderWithUser(id_pedido);
      const detalles = await Order.getOrderDetails(id_pedido);
      if (orderData) {
        sendOrderAccepted(orderData.email, orderData.nombre_usuario, pedido, detalles)
          .catch(err => console.error('Error enviando email de confirmación:', err));
      }
    } catch (error) {
      console.error('Error procesando webhook checkout.session.completed:', error);
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
