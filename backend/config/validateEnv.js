const required = ['JWT_SECRET', 'DATABASE_URL'];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`ERROR FATAL: Variables de entorno obligatorias no definidas: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error('ERROR FATAL: JWT_SECRET debe tener al menos 32 caracteres');
    process.exit(1);
  }
};

module.exports = validateEnv;
