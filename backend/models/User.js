const db = require('../config/db');

const User = {

  findByEmail: async (email) => {
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results[0];
  },

  create: async ({ nombre, email, password, altura = null, peso = null, edad = null, avatar_config = null }) => {
    const sql = `
      INSERT INTO usuarios (nombre, email, password, altura, peso, edad, rol, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, 'user', ?)
    `;
    const [result] = await db.query(sql, [nombre, email, password, altura, peso, edad, avatar_config]);
    
    return result.insertId;
  }

};

module.exports = User;