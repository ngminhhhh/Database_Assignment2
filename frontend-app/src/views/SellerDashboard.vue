<template>
  <div class="container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 class="text-primary fw-bold mb-3 mb-md-0"><i class="bi bi-speedometer2"></i> Kênh Người Bán</h3>
        <span class="badge bg-secondary p-2">Seller ID: {{ user.seller_id || 'SEL0001' }}</span>
    </div>
    
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-header bg-white py-3">
          <h5 class="card-title mb-0 text-primary">Đăng bán sản phẩm mới</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="createProduct" class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label">Tên sản phẩm</label>
            <input v-model="newProduct.name" type="text" class="form-control" required>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Giá (VND)</label>
            <input v-model="newProduct.price" type="number" class="form-control" required>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Kho</label>
            <input v-model="newProduct.stock_quantity" type="number" class="form-control" required>
          </div>
          <div class="col-12">
            <label class="form-label">Mô tả</label>
            <textarea v-model="newProduct.description" class="form-control" rows="2"></textarea>
          </div>
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-success w-100 w-md-auto">
              <i class="bi bi-plus-circle me-1"></i> Đăng sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">Kho hàng của tôi</h5>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 text-nowrap">
                <thead class="table-light">
                    <tr>
                    <th scope="col" class="ps-4">ID</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá bán</th>
                    <th scope="col">Tồn kho</th>
                    <th scope="col" class="text-end pe-4">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in myProducts" :key="p.product_id">
                    <td class="ps-4">#{{ p.product_id }}</td>
                    <td class="fw-bold text-primary">{{ p.name }}</td>
                    <td>{{ p.price }} ₫</td>
                    <td>
                        <span class="badge" :class="p.stock_quantity > 0 ? 'bg-success' : 'bg-danger'">
                            {{ p.stock_quantity }}
                        </span>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(p.product_id)">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Xóa</span>
                        </button>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div v-if="myProducts.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-box-seam fs-1 d-block mb-2"></i>
                Chưa có sản phẩm nào
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api';
// ... (Logic giữ nguyên như bài trước)
const myProducts = ref([]);
const user = JSON.parse(localStorage.getItem('user') || '{}');
const currentSellerId = 'SEL0001'; 
const newProduct = reactive({ seller_id: currentSellerId, name: '', description: '', price: '', stock_quantity: '' });
const loadProducts = async () => {
  const res = await api.getProducts({});
  if(res.data.success) myProducts.value = res.data.data.filter(p => p.seller_id === currentSellerId);
};
const createProduct = async () => {
  try { await api.createProduct(newProduct); alert("Thêm thành công!"); loadProducts(); newProduct.name = ''; newProduct.price = ''; } 
  catch (e) { alert("Lỗi: " + e.message); }
};
const deleteProduct = async (id) => { if(confirm("Xóa nhé?")) { await api.deleteProduct(id); loadProducts(); } };
onMounted(loadProducts);
</script>