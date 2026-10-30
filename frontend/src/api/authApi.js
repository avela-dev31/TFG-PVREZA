import api from './axios';

export const loginRequest = (data) => api.post('/auth/login', data);
export const registerRequest = (data) => api.post('/auth/register', data);
export const googleLoginRequest = (credential) => api.post('/auth/google', { credential });
export const appleLoginRequest = (id_token, user) => api.post('/auth/apple', { id_token, user });

export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);
export const updatePassword = (data) => api.put('/users/me/password', data);

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPasswordRequest = (token, password) => api.post('/auth/reset-password', { token, password });

export const verify2FA = (tempToken, code) => api.post('/auth/2fa/verify', { tempToken, code });
export const setup2FA = () => api.post('/auth/2fa/setup');
export const verifySetup2FA = (code) => api.post('/auth/2fa/verify-setup', { code });
export const disable2FA = (code) => api.post('/auth/2fa/disable', { code });
export const get2FAStatus = () => api.get('/auth/2fa/status');

export const getFavoritos = () => api.get('/users/favoritos');
export const addFavorito = (idProducto) => api.post(`/users/favoritos/${idProducto}`);
export const removeFavorito = (idProducto) => api.delete(`/users/favoritos/${idProducto}`);