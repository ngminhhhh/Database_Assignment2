import axios from 'axios';

// Kết nối với Backend Node.js của bạn
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
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
  // Users API  (Tạm dùng để giả lập login vì backend chưa có route /login)
  getUsers() {
    return apiClient.get('/users');
  }
};