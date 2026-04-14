const db = require('../config/db');

const User = {

  findByEmail: async (email) => {
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results[0];
  },

  create: async ({ nombre, email, password, altura = null, peso = null, edad = null }) => {
    const sql = `
      INSERT INTO usuarios (nombre, email, password, altura, peso, edad, rol)
      VALUES (?, ?, ?, ?, ?, ?, 'user')
    `;
    const [result] = await db.query(sql, [nombre, email, password, altura, peso, edad]);
    return result.insertId;
  }

};

module.exports = User;