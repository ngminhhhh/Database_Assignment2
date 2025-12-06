<template>
  <div class="container py-4">
    <div class="card mb-4 border-0 shadow-sm">
      <div class="card-body">
        <div class="row g-3"> <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label small fw-bold text-muted">Giá tối thiểu</label>
            <input v-model="filters.minPrice" type="number" class="form-control" placeholder="0">
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label small fw-bold text-muted">Giá tối đa</label>
            <input v-model="filters.maxPrice" type="number" class="form-control" placeholder="Max">
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label small fw-bold text-muted">Sắp xếp theo</label>
            <select v-model="filters.sortBy" class="form-select">
              <option value="upload_date">Mới nhất</option>
              <option value="price">Giá</option>
              <option value="name">Tên</option>
            </select>
          </div>
          <div class="col-12 col-md-6 col-lg-3 d-flex align-items-end">
            <button @click="fetchProducts" class="btn btn-primary w-100 fw-bold">
              <i class="bi bi-funnel-fill"></i> Lọc dữ liệu
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3"> <div class="col-6 col-md-4 col-lg-3" v-for="product in products" :key="product.product_id">
        <div class="card h-100 shadow-sm product-card">
          <div class="ratio ratio-4x3"> <img src="https://via.placeholder.com/300x200?text=Product" class="card-img-top object-fit-cover" alt="...">
          </div>
          <div class="card-body d-flex flex-column p-2 p-md-3"> <h6 class="card-title text-truncate mb-1">{{ product.name }}</h6>
            <p class="card-text text-primary fw-bold mb-1">{{ formatCurrency(product.price) }}</p>
            <small class="text-muted mb-3 d-block text-truncate">
              <i class="bi bi-shop"></i> {{ product.store_name }}
            </small>
            <router-link :to="`/product/${product.product_id}`" class="btn btn-outline-primary btn-sm mt-auto w-100">
              Chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (Giữ nguyên script cũ)
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api';

const products = ref([]);
const filters = reactive({ minPrice: '', maxPrice: '', sortBy: 'upload_date', order: 'DESC' });
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const fetchProducts = async () => {
  try {
    const res = await api.getProducts(filters);
    if (res.data.success) products.value = res.data.data;
  } catch (err) { console.error(err); }
};
onMounted(fetchProducts);
</script>

<style scoped>
/* Hiệu ứng hover nhẹ cho sản phẩm */
.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary-color);
  transition: all 0.2s;
}
</style>