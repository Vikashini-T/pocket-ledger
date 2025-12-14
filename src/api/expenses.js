// src/api/expenses.js
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

export const getExpenses = () => api.get('/api/expenses');
export const createExpense = (data) => api.post('/api/expenses', data);
export const updateExpense = (id, data) => api.put(`/api/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/api/expenses/${id}`);
export default api;
