<template>
  <div class="container py-4 py-md-5" v-if="product">
    <div class="row">
      <div class="col-md-6 mb-4 mb-md-0">
        <div class="card border-0 shadow-sm p-2">
           <img src="../assets/images/noimage.svg" class="img-fluid rounded" alt="">
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="ps-md-4"> <h1 class="display-6 fw-bold text-dark mb-3">{{ product.name }}</h1>
            
            <div class="d-flex align-items-center mb-3">
                 <span class="badge bg-custom-blue me-2">Mới</span>
                 <span class="text-muted small">Đăng ngày: {{ new Date(product.upload_date).toLocaleDateString() }}</span>
            </div>

            <h2 class="text-primary fw-bold mb-4">{{ formatCurrency(product.price) }}</h2>
            
            <p class="lead fs-6 text-secondary mb-4">{{ product.description }}</p>
            
            <div class="card bg-light border-0 p-3 mb-4 rounded-3">
              <div class="d-flex align-items-center">
                <div class="bg-white p-2 rounded-circle shadow-sm me-3 text-primary">
                    <i class="bi bi-shop fs-4"></i>
                </div>
                <div>
                  <h6 class="mb-0 fw-bold">{{ product.store_name }}</h6>
                  <small class="text-muted">{{ product.seller_email }}</small>
                </div>
              </div>
            </div>

            <div class="d-grid gap-2">
                <button class="btn btn-primary btn-lg shadow-sm">
                <i class="bi bi-cart-plus me-2"></i> Thêm vào giỏ hàng
                </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
const route = useRoute();
const product = ref(null);
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
onMounted(async () => {
  const id = route.params.id;
  const res = await api.getProduct(id);
  if (res.data.success) product.value = res.data.data;
});
</script>