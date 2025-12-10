<template>
  <div class="container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 class="text-primary fw-bold mb-3 mb-md-0"><i class="bi bi-speedometer2"></i> Kênh Người Bán</h3>
        <span class="badge bg-secondary p-2">Seller ID: {{ user.seller_id || 'SEL0001' }}</span>
    </div>

    <ul class="nav nav-tabs mb-4" id="sellerTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab">
                <i class="bi bi-box-seam me-1"></i> Quản lý Sản phẩm
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab" @click="fetchMonthlyStats">
                <i class="bi bi-receipt me-1"></i> Đơn hàng & Doanh thu
            </button>
        </li>
    </ul>

    <div class="tab-content" id="sellerTabsContent">
        
        <div class="tab-pane fade show active" id="products" role="tabpanel" tabindex="0">
            <div class="card border-0 shadow-sm mb-4" :class="isEditing ? 'border-warning border-start border-4' : 'border-primary border-start border-4'">
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0" :class="isEditing ? 'text-warning' : 'text-primary'">
                        {{ isEditing ? 'Cập nhật sản phẩm' : 'Đăng bán sản phẩm mới' }}
                    </h5>
                    <span v-if="isEditing" class="badge bg-warning text-dark">Đang chỉnh sửa ID: #{{ editingId }}</span>
                </div>
                <div class="card-body">
                    <form @submit.prevent="handleSubmit" class="row g-3">
                        <div class="col-12 col-md-6">
                            <label class="form-label">Tên sản phẩm</label>
                            <input v-model="formProduct.name" type="text" class="form-control" required>
                        </div>
                        <div class="col-6 col-md-3">
                            <label class="form-label">Giá (VND)</label>
                            <input v-model="formProduct.price" type="number" class="form-control" required>
                        </div>
                        <div class="col-6 col-md-3">
                            <label class="form-label">Kho</label>
                            <input v-model="formProduct.stock_quantity" type="number" class="form-control" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Mô tả</label>
                            <textarea v-model="formProduct.description" class="form-control" rows="2"></textarea>
                        </div>
                        
                        <div class="col-12 text-end">
                            <button v-if="isEditing" type="button" class="btn btn-secondary me-2" @click="cancelEdit">
                                <i class="bi bi-x-circle"></i> Hủy bỏ
                            </button>
                            
                            <button type="submit" class="btn" :class="isEditing ? 'btn-warning text-dark' : 'btn-success'">
                                <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-plus-circle'"></i> 
                                {{ isEditing ? 'Lưu thay đổi' : 'Đăng sản phẩm' }}
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
                                <tr v-for="p in myProducts" :key="p.product_id" :class="{'table-active': p.product_id === editingId}">
                                <td class="ps-4">#{{ p.product_id }}</td>
                                <td class="fw-bold text-primary text-wrap" style="max-width: 300px;">{{ p.name }}</td>
                                <td>{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price) }}</td>
                                <td>
                                    <span class="badge" :class="p.stock_quantity > 0 ? 'bg-success' : 'bg-danger'">
                                        {{ p.stock_quantity }}
                                    </span>
                                </td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-warning me-2" @click="startEdit(p)">
                                        <i class="bi bi-pencil"></i> <span class="d-none d-md-inline">Sửa</span>
                                    </button>
                                    
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

        <div class="tab-pane fade" id="orders" role="tabpanel" tabindex="0">
            <div class="card border-0 shadow-sm mb-4 bg-light">
                <div class="card-body">
                    <h5 class="card-title text-primary mb-3">
                        <i class="bi bi-bar-chart-line-fill me-2"></i>Báo cáo Doanh thu Tháng (Stored Procedure)
                    </h5>
                    <div class="row g-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label small">Tháng</label>
                            <select v-model="statsParams.month" class="form-select">
                                <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small">Năm</label>
                            <input v-model="statsParams.year" type="number" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <button @click="fetchMonthlyStats" class="btn btn-primary w-100">
                                Xem báo cáo
                            </button>
                        </div>
                    </div>

                    <div v-if="monthlyStats.length > 0" class="mt-3">
                        <table class="table table-sm table-bordered bg-white">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng bán</th>
                                    <th>Tổng doanh thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in monthlyStats" :key="stat.product_id">
                                    <td>{{ stat.product_name }}</td>
                                    <td class="text-center">{{ stat.total_sold_quantity }}</td>
                                    <td class="text-end fw-bold text-success">
                                        {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.total_revenue) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else-if="statsLoaded" class="mt-3 text-muted small">
                        <i class="bi bi-info-circle"></i> Không có dữ liệu doanh thu cho tháng này.
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Lịch sử đơn hàng chi tiết</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api';

const myProducts = ref([]);
const user = JSON.parse(localStorage.getItem('user') || '{}');
const currentSellerId = 'SEL0001'; // Demo ID

// Trạng thái edit
const isEditing = ref(false);
const editingId = ref(null);

// Form data (Dùng chung cho cả Thêm và Sửa)
const formProduct = reactive({
  seller_id: currentSellerId,
  name: '',
  description: '',
  price: '',
  stock_quantity: ''
});

// --- LOGIC MỚI: DOANH THU (Stored Procedure) ---
const statsParams = reactive({
  month: new Date().getMonth() + 1, // Mặc định tháng hiện tại
  year: new Date().getFullYear()
});
const monthlyStats = ref([]);
const statsLoaded = ref(false);

// Load danh sách
const loadProducts = async () => {
  try {
    const res = await api.getProducts({});
    if(res.data.success) {
      // Lọc tạm phía client
      myProducts.value = res.data.data.filter(p => p.seller_id === currentSellerId);
    }
  } catch (err) {
    console.error(err);
  }
};

// 1. BẮT ĐẦU SỬA: Đổ dữ liệu lên form
const startEdit = (product) => {
  isEditing.value = true;
  editingId.value = product.product_id;
  
  // Copy dữ liệu từ dòng được chọn vào form
  formProduct.name = product.name;
  formProduct.description = product.description;
  formProduct.price = product.price;
  formProduct.stock_quantity = product.stock_quantity;
  
  // Cuộn trang lên đầu để thấy form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 2. HỦY SỬA: Reset form
const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
};

const resetForm = () => {
  formProduct.name = '';
  formProduct.description = '';
  formProduct.price = '';
  formProduct.stock_quantity = '';
};

// 3. XỬ LÝ SUBMIT (Chung cho cả 2 hành động)
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // GỌI API UPDATE
      await api.updateProduct(editingId.value, formProduct);
      alert("Cập nhật thành công!");
      cancelEdit(); // Thoát chế độ sửa
    } else {
      // GỌI API CREATE
      await api.createProduct(formProduct);
      alert("Thêm sản phẩm thành công!");
      resetForm();
    }
    // Load lại bảng
    loadProducts();
  } catch (e) {
    alert("Lỗi: " + (e.response?.data?.message || e.message));
  }
};

// Xóa (Giữ nguyên)
const deleteProduct = async (id) => {
  if(confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    try {
      await api.deleteProduct(id);
      
      // Nếu đang sửa đúng sản phẩm vừa xóa thì reset form luôn
      if (isEditing.value && editingId.value === id) {
        cancelEdit();
      }
      
      loadProducts();
    } catch (e) {
      alert("Lỗi khi xóa: " + e.message);
    }
  }
};

const fetchMonthlyStats = async () => {
  try {
    // Sử dụng hàm từ api.js
    const res = await api.getMonthlyStats({
      seller_id: currentSellerId, // Đảm bảo biến này có giá trị (VD: 'SEL0001')
      month: statsParams.month,
      year: statsParams.year
    });

    if (res.data.success) {
      monthlyStats.value = res.data.data;
      statsLoaded.value = true;
    }
  } catch (e) {
    console.error("Lỗi lấy báo cáo:", e);
    // Hiển thị lỗi rõ ràng hơn
    const msg = e.response?.data?.message || e.message;
    alert(`Không thể lấy báo cáo: ${msg}`);
  }
};

onMounted(loadProducts);
</script>