import api from './axios';

export const loginRequest = (data) => api.post('/auth/login', data);
export const registerRequest = (data) => api.post('/auth/register', data);

export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);
export const updatePassword = (data) => api.put('/users/me/password', data);

export const getFavoritos = () => api.get('/users/favoritos');
export const addFavorito = (idProducto) => api.post(`/users/favoritos/${idProducto}`);
export const removeFavorito = (idProducto) => api.delete(`/users/favoritos/${idProducto}`);