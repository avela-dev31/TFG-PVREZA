const db = require('../config/db');

const Order = {

  create: async (id_usuario, total) => {
    const [result] = await db.query(
      'INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, "pendiente")',
      [id_usuario, total]
    );
    return result.insertId;
  },

  addDetail: async (id_pedido, id_stock, cantidad, precio_unitario) => {
    await db.query(
      'INSERT INTO detalles_pedido (id_pedido, id_stock, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [id_pedido, id_stock, cantidad, precio_unitario]
    );
  },

  getByUser: async (id_usuario) => {
    const [results] = await db.query(
      `SELECT p.*, d.id_stock, d.cantidad, d.precio_unitario 
       FROM pedidos p
       JOIN detalles_pedido d ON p.id_pedido = d.id_pedido
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_pedido DESC`,
      [id_usuario]
    );
    return results;
  },

  getAll: async () => {
    const [results] = await db.query(
      `SELECT p.*, d.id_stock, d.cantidad, d.precio_unitario
       FROM pedidos p
       JOIN detalles_pedido d ON p.id_pedido = d.id_pedido
       ORDER BY p.fecha_pedido DESC`
    );
    return results;
  },

  checkStock: async (id_stock) => {
    const [results] = await db.query(
      'SELECT stock FROM stock WHERE id_stock = ?', [id_stock]
    );
    return results[0];
  },

  decreaseStock: async (id_stock, cantidad) => {
    await db.query(
      'UPDATE stock SET stock = stock - ? WHERE id_stock = ?',
      [cantidad, id_stock]
    );
  }

};

module.exports = Order;