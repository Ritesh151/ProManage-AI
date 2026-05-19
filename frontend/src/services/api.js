import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);

export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects/create', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const proposalAPI = {
  generate: (id) => api.get(`/proposal/generate/${id}`),
  downloadPDF: (id) => api.get(`/proposal/pdf/${id}`, { responseType: 'blob' }),
  downloadWord: (id) => api.get(`/proposal/word/${id}`, { responseType: 'blob' }),
};

export const exportAPI = {
  csv: () => api.get('/export/csv', { responseType: 'blob' }),
  excel: () => api.get('/export/excel', { responseType: 'blob' }),
  pdf: () => api.get('/export/pdf', { responseType: 'blob' }),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export default api;
