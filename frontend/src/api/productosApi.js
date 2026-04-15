import api from './axios';

export const getProductos = () => api.get('/camisetas');
export const getProductoById = (id) => api.get(`/camisetas/${id}`);
export const getVariantes = (id) => api.get(`/camisetas/${id}/variantes`);