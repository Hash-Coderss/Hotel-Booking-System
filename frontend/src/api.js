import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// User
export const getMyProfile = () => api.get('/users/me');
export const createUserProfile = (data) => api.post('/users', data);
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data);

// Hotels
export const getAllHotels = (city) => api.get('/hotel', { params: city ? { city } : {} });
export const getHotel = (id) => api.get(`/hotel/${id}`);
export const addHotel = (data) => api.post('/hotel', data);
export const updateHotel = (id, data) => api.put(`/hotel/${id}`, data);
export const deleteHotel = (id) => api.delete(`/hotel/${id}`);

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.put(`/bookings/cancel/${id}`);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);

export default api;
