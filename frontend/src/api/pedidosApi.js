import api from './axios';

export const crearPedido = (items) => api.post('/pedidos', { items });
export const getMisPedidos = () => api.get('/pedidos/mis-pedidos');
export const getTodosPedidos = () => api.get('/pedidos/todos');
export const getDashboardStats = () => api.get('/pedidos/dashboard-stats');
export const actualizarEstadoPedido = (id, estado) => api.put(`/pedidos/${id}/estado`, { estado });
