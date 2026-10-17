import api from './axios';

export const crearReserva = (email, coleccion) => api.post('/reservas', { email, coleccion });
export const getPlazas = (coleccion) => api.get(`/reservas/${coleccion}/plazas`);
