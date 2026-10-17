const db = require('../config/db');

const Product = {

  create: async ({ nombre, descripcion, precio, coleccion, imagen_url = null }) => {
    const { rows } = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, coleccion, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING id_producto',
      [nombre, descripcion, precio, coleccion, imagen_url]
    );
    return rows[0].id_producto;
  },

  getAll: async () => {
    const { rows } = await db.query(`
      SELECT p.*,
        COALESCE(p.imagen_url, (
          SELECT url FROM imagenes_producto
          WHERE id_producto = p.id_producto
          ORDER BY orden ASC LIMIT 1
        )) AS imagen_url
      FROM productos p
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(
      'SELECT * FROM productos WHERE id_producto = $1', [id]
    );
    return rows[0];
  },

  getByIdCompleto: async (id) => {
    const { rows: producto } = await db.query(
      'SELECT * FROM productos WHERE id_producto = $1', [id]
    );
    const { rows: stock } = await db.query(
      'SELECT * FROM stock WHERE id_producto = $1 ORDER BY talla', [id]
    );
    const { rows: imagenes } = await db.query(
      'SELECT * FROM imagenes_producto WHERE id_producto = $1 ORDER BY orden', [id]
    );
    return { producto: producto[0], stock, imagenes };
  },

  getVariantes: async (id) => {
    const { rows } = await db.query(
      'SELECT * FROM stock WHERE id_producto = $1', [id]
    );
    return rows;
  },

  getImagenes: async (id) => {
    const { rows } = await db.query(
      'SELECT url FROM imagenes_producto WHERE id_producto = $1 ORDER BY orden ASC',
      [id]
    );
    return rows;
  },

  update: async (id, { nombre, descripcion, coleccion }) => {
    const { rowCount } = await db.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, coleccion = $3 WHERE id_producto = $4',
      [nombre, descripcion, coleccion, id]
    );
    return rowCount;
  },

  delete: async (id) => {
    const { rowCount } = await db.query(
      'DELETE FROM productos WHERE id_producto = $1', [id]
    );
    return rowCount;
  },

  getAllWithStock: async () => {
    const { rows } = await db.query(`
      SELECT p.id_producto, p.nombre, p.precio, p.coleccion,
        COALESCE(SUM(s.cantidad), 0) AS stock_total
      FROM productos p
      LEFT JOIN stock s ON p.id_producto = s.id_producto
      GROUP BY p.id_producto
      ORDER BY p.id_producto
    `);
    return rows;
  }

};

module.exports = Product;
