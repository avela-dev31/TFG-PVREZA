require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.query("SELECT 1")
  .then(() => console.log("Conexion a PostgreSQL establecida"))
  .catch((err) => console.error("Error conectando a PostgreSQL:", err.message));

module.exports = pool;
