const db = require('../config/db');

const User = {

  findByEmail: async (email) => {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    return rows[0];
  },

  create: async ({ nombre, email, password, altura = null, peso = null, edad = null }) => {
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, email, password, altura, peso, edad, rol)
       VALUES ($1, $2, $3, $4, $5, $6, 'user') RETURNING id_usuario`,
      [nombre, email, password, altura, peso, edad]
    );
    return rows[0].id_usuario;
  },

  update: async (id, { nombre, email, altura, peso }) => {
    const { rows } = await db.query(
      `UPDATE usuarios SET nombre = $1, email = $2, altura = $3, peso = $4
       WHERE id_usuario = $5
       RETURNING id_usuario, nombre, email, rol, altura, peso`,
      [nombre, email, altura, peso, id]
    );
    return rows[0];
  },

  updatePassword: async (id, hashedPassword) => {
    const { rowCount } = await db.query(
      'UPDATE usuarios SET password = $1 WHERE id_usuario = $2',
      [hashedPassword, id]
    );
    return rowCount;
  },

  getFavoritos: async (userId) => {
    const { rows } = await db.query(
      `SELECT p.* FROM favoritos f
       JOIN productos p ON f.id_producto = p.id_producto
       WHERE f.id_usuario = $1
       ORDER BY f.fecha_agregado DESC`,
      [userId]
    );
    return rows;
  },

  addFavorito: async (userId, productoId) => {
    const { rows } = await db.query(
      `INSERT INTO favoritos (id_usuario, id_producto)
       VALUES ($1, $2)
       ON CONFLICT (id_usuario, id_producto) DO NOTHING
       RETURNING *`,
      [userId, productoId]
    );
    return rows[0];
  },

  removeFavorito: async (userId, productoId) => {
    const { rowCount } = await db.query(
      'DELETE FROM favoritos WHERE id_usuario = $1 AND id_producto = $2',
      [userId, productoId]
    );
    return rowCount;
  },

  saveResetToken: async (id, token, expires) => {
    await db.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id_usuario = $3',
      [token, expires, id]
    );
  },

  findByResetToken: async (token) => {
    const { rows } = await db.query(
      'SELECT * FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    return rows[0];
  },

  clearResetToken: async (id) => {
    await db.query(
      'UPDATE usuarios SET reset_token = NULL, reset_token_expires = NULL WHERE id_usuario = $1',
      [id]
    );
  },

  saveTotpSecret: async (id, secret) => {
    await db.query(
      'UPDATE usuarios SET totp_secret = $1 WHERE id_usuario = $2',
      [secret, id]
    );
  },

  enableTotp: async (id) => {
    await db.query(
      'UPDATE usuarios SET totp_enabled = TRUE WHERE id_usuario = $1',
      [id]
    );
  },

  disableTotp: async (id) => {
    await db.query(
      'UPDATE usuarios SET totp_secret = NULL, totp_enabled = FALSE WHERE id_usuario = $1',
      [id]
    );
  },

  findOrCreateOAuth: async ({ email, nombre, provider }) => {
    const { rows: existing } = await db.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    );
    if (existing[0]) return { user: existing[0], isNew: false };

    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, email, auth_provider, rol)
       VALUES ($1, $2, $3, 'user') RETURNING *`,
      [nombre, email, provider]
    );
    return { user: rows[0], isNew: true };
  }

};

module.exports = User;
