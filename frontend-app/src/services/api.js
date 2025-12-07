import axios from 'axios';

// In Docker: API is proxied through nginx at /api (same origin)
// In local development: use localhost:3000/api
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Products API 
  getProducts(params) {
    return apiClient.get('/products', { params });
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  createProduct(data) {
    return apiClient.post('/products', data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
  updateProduct(id, data) {
    return apiClient.put(`/products/${id}`, data);
  },
  // BE chưa có route login =)))
  getUsers() {
    return apiClient.get('/users');
  }
};