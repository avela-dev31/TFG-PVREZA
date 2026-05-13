import api from './axios';

export const getProductos = () => api.get('/camisetas');
export const getProductoById = (id) => api.get(`/camisetas/${id}`);
export const getVariantes = (id) => api.get(`/camisetas/${id}/variantes`);
export const getProductosConStock = () => api.get('/camisetas/admin/stock');
export const crearProducto = (data) => api.post('/camisetas', data);
export const eliminarProducto = (id) => api.delete(`/camisetas/${id}`);