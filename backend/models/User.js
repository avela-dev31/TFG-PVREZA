const db = require('../config/db');

const User = {

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: ({ nombre, email, password, altura = null, peso = null, edad = null }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO usuarios (nombre, email, password, altura, peso, edad, rol)
        VALUES (?, ?, ?, ?, ?, ?, 'user')
      `;
      db.query(sql, [nombre, email, password, altura, peso, edad], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }

};

module.exports = User;