const mysql = require("mysql2/promise");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const pool = mysql.createPool({
  host: process.env.PMA_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "pvreza_db",
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conexión a MySQL establecida");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err.message);
  });

module.exports = pool;
