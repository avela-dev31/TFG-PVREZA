const db = require('../config/db');

const Reserva = {

  create: async (email, coleccion) => {
    const { rows } = await db.query(
      `INSERT INTO reservas (email, coleccion)
       VALUES ($1, $2)
       ON CONFLICT (email, coleccion) DO NOTHING
       RETURNING *`,
      [email, coleccion]
    );
    return rows[0];
  },

  countByColeccion: async (coleccion) => {
    const { rows } = await db.query(
      'SELECT COUNT(*) AS total FROM reservas WHERE coleccion = $1',
      [coleccion]
    );
    return parseInt(rows[0].total);
  }

};

module.exports = Reserva;
