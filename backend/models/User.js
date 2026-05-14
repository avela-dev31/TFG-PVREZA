const db = require('../config/db');

const User = {

  findByEmail: async (email) => {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return rows[0];
  },

  create: async ({ nombre, email, password, altura = null, peso = null, edad = null, avatar_url = null }) => {
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, email, password, altura, peso, edad, rol, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, 'user', $7) RETURNING id_usuario`,
      [nombre, email, password, altura, peso, edad, avatar_url]
    );
    return rows[0].id_usuario;
  }

};

module.exports = User;
