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

  // 💥 NUEVO: Lo metemos DENTRO del objeto Product
  getImagenes: async (id) => {
    const [rows] = await db.query(
      'SELECT url FROM imagenes_producto WHERE id_producto = ? ORDER BY orden ASC', 
      [id]
    );
    return rows;
  },

  update: async (id, { nombre, descripcion, coleccion }) => {
    const [result] = await db.query(
      // Corregida la tilde de "coleccion"
      'UPDATE productos SET nombre = ?, descripcion = ?, coleccion = ? WHERE id_producto = ?',
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

// Exportamos el objeto entero
module.exports = Product;