const db = require('../config/db');

const Order = {

  create: async (id_usuario, total) => {
    const { rows } = await db.query(
      "INSERT INTO pedidos (id_usuario, total, estado) VALUES ($1, $2, 'pendiente') RETURNING id_pedido",
      [id_usuario, total]
    );
    return rows[0].id_pedido;
  },

  addDetail: async (id_pedido, id_stock, cantidad, precio_unitario) => {
    await db.query(
      'INSERT INTO detalles_pedido (id_pedido, id_stock, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
      [id_pedido, id_stock, cantidad, precio_unitario]
    );
  },

  getByUser: async (id_usuario) => {
    const { rows } = await db.query(
      `SELECT p.id_pedido, p.total, p.estado, p.fecha_pedido,
              d.cantidad, d.precio_unitario,
              pr.nombre, pr.imagen_url, s.talla
       FROM pedidos p
       JOIN detalles_pedido d ON p.id_pedido = d.id_pedido
       JOIN stock s ON d.id_stock = s.id_stock
       JOIN productos pr ON s.id_producto = pr.id_producto
       WHERE p.id_usuario = $1
       ORDER BY p.fecha_pedido DESC`,
      [id_usuario]
    );
    return rows;
  },

  getAll: async () => {
    const { rows } = await db.query(
      `SELECT p.*, d.id_stock, d.cantidad, d.precio_unitario
       FROM pedidos p
       JOIN detalles_pedido d ON p.id_pedido = d.id_pedido
       ORDER BY p.fecha_pedido DESC`
    );
    return rows;
  },

  checkStock: async (id_stock) => {
    const { rows } = await db.query(
      `SELECT s.cantidad, p.precio
       FROM stock s
       JOIN productos p ON s.id_producto = p.id_producto
       WHERE s.id_stock = $1`,
      [id_stock]
    );
    return rows[0];
  },

  decreaseStock: async (id_stock, cantidad) => {
    await db.query(
      'UPDATE stock SET cantidad = cantidad - $1 WHERE id_stock = $2',
      [cantidad, id_stock]
    );
  },

  getMonthSales: async () => {
    const { rows } = await db.query(`
      SELECT COALESCE(SUM(total), 0) AS ventas_mes
      FROM pedidos
      WHERE EXTRACT(MONTH FROM fecha_pedido) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM fecha_pedido) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    return rows[0].ventas_mes;
  },

  getActiveOrdersCount: async () => {
    const { rows } = await db.query(`
      SELECT COUNT(*) AS pedidos_activos
      FROM pedidos
      WHERE estado IN ('pendiente', 'pagado', 'enviado')
    `);
    return rows[0].pedidos_activos;
  },

  getCriticalStockCount: async () => {
    const { rows } = await db.query(`
      SELECT COUNT(*) AS stock_critico
      FROM (
        SELECT p.id_producto
        FROM productos p
        LEFT JOIN stock s ON p.id_producto = s.id_producto
        GROUP BY p.id_producto
        HAVING COALESCE(SUM(s.cantidad), 0) = 0
      ) AS agotados
    `);
    return rows[0].stock_critico;
  }

};

module.exports = Order;
