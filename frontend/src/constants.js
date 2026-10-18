export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const imgUrl = (path) =>
  path && path.startsWith('http') ? path : `${BACKEND_URL}${path || ''}`;
