const db = require('../config/db');

const Product = {

  getAll: async () => {
    const [results] = await db.query('SELECT * FROM productos');
    return results;
  },

  getById: async (id) => {
    const [results] = await db.query(
      'SELECT * FROM productos WHERE id_producto = ?', [id]
    );
    return results[0];
  },

  getVariantes: async (id) => {
    const [results] = await db.query(
      'SELECT * FROM stock WHERE id_producto = ?', [id]
    );
    return results;
  },

  update: async (id, { nombre, descripcion, coleccion }) => {
    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, colección = ? WHERE id_producto = ?',
      [nombre, descripcion, coleccion, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM productos WHERE id_producto = ?', [id]
    );
    return result.affectedRows;
  }

};

module.exports = Product;