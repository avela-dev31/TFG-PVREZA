const db = require('../config/db');

const Product = {

  getAll: async () => {
    const [results] = await db.query(`
      SELECT p.*,
        COALESCE(p.imagen_url, (
          SELECT url FROM imagenes_producto
          WHERE id_producto = p.id_producto
          ORDER BY orden ASC LIMIT 1
        )) AS imagen_url
      FROM productos p
    `);
    return results;
  },

  getById: async (id) => {
    const [results] = await db.query(
      'SELECT * FROM productos WHERE id_producto = ?', [id]
    );
    return results[0];
  },

  getByIdCompleto: async (id) => {
  const [producto] = await db.query(
    'SELECT * FROM productos WHERE id_producto = ?', [id]
  );
  const [stock] = await db.query(
    'SELECT * FROM stock WHERE id_producto = ? ORDER BY talla', [id]
  );
  const [imagenes] = await db.query(
    'SELECT * FROM imagenes_producto WHERE id_producto = ? ORDER BY orden', [id]
  );
  return { producto: producto[0], stock, imagenes };
},

  getVariantes: async (id) => { 
    const [results] = await db.query(
      'SELECT * FROM stock WHERE id_producto = ?', [id]
    );
    return results;
  },

  getImagenes: async (id) => {
    const [rows] = await db.query(
      'SELECT url FROM imagenes_producto WHERE id_producto = ? ORDER BY orden ASC', 
      [id]
    );
    return rows;
  },

  update: async (id, { nombre, descripcion, coleccion }) => {
    const [result] = await db.query(
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
  },

  getAllWithStock: async () => {
    const [results] = await db.query(`
      SELECT p.id_producto, p.nombre, p.precio, p.coleccion,
        COALESCE(SUM(s.cantidad), 0) AS stock_total
      FROM productos p
      LEFT JOIN stock s ON p.id_producto = s.id_producto
      GROUP BY p.id_producto
      ORDER BY p.id_producto
    `);
    return results;
  }

};

module.exports = Product;