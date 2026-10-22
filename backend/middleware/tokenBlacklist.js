const blacklist = new Set();

const addToBlacklist = (token) => {
  blacklist.add(token);
};

const isBlacklisted = (token) => {
  return blacklist.has(token);
};

const jwt = require('jsonwebtoken');

setInterval(() => {
  for (const token of blacklist) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
        blacklist.delete(token);
      }
    } catch {
      blacklist.delete(token);
    }
  }
}, 60 * 60 * 1000);

module.exports = { addToBlacklist, isBlacklisted };
