<template>
  <div class="container py-5" v-if="product">
    <div class="row">
      <div class="col-md-6 mb-4 mb-md-0">
        <div class="card border-0 shadow-sm p-2">
           <img src="../assets/images/noimage.svg" class="img-fluid rounded" alt="">
        </div>
      </div>
      
      <div class="col-md-6">
        <h1 class="display-6 fw-bold text-dark mb-3">{{ product.name }}</h1>
        <h2 class="text-danger fw-bold mb-4">{{ formatCurrency(product.price) }}</h2>
        <p class="lead fs-6 text-secondary mb-4">{{ product.description }}</p>
        
        <div class="d-grid gap-2 d-md-flex">
            <!-- <button @click="addToCart" class="btn btn-outline-primary btn-lg flex-grow-1">
                <i class="bi bi-cart-plus me-2"></i> Thêm giỏ hàng
            </button> -->
            <button @click="openBuyNowModal" class="btn btn-primary btn-lg flex-grow-1">
                <i class="bi bi-lightning-charge-fill me-2"></i> Mua ngay
            </button>
        </div>
      </div>
    </div>

    <div class="modal fade" id="buyNowModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-bag-check-fill me-2"></i>Xác nhận đơn hàng</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div class="col-md-7 border-end">
                    <h6 class="fw-bold mb-3">Thông tin giao hàng</h6>
                    <form id="orderForm">
                        <div class="mb-3">
                            <label class="form-label small text-muted">Người nhận</label>
                            <input v-model="orderInfo.recipient_name" type="text" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Số điện thoại</label>
                            <input v-model="orderInfo.phone" type="tel" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Địa chỉ giao hàng</label>
                            <textarea v-model="orderInfo.recipient_address" class="form-control" rows="2" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Phương thức thanh toán</label>
                            <select v-model="orderInfo.payment_method" class="form-select">
                                <option value="CASH">Tiền mặt khi nhận hàng (COD)</option>
                                <option value="CREDIT_CARD">Thẻ tín dụng</option>
                                <option value="WALLET">Ví điện tử</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div class="col-md-5">
                    <h6 class="fw-bold mb-3">Sản phẩm</h6>
                    <div class="d-flex align-items-center mb-3">
                        <img src="https://via.placeholder.com/50" class="rounded me-2">
                        <div class="flex-grow-1 text-truncate small">{{ product.name }}</div>
                        <div class="fw-bold">{{ formatCurrency(product.price) }}</div>
                    </div>
                    
                    <hr>
                    
                    <div class="mb-3">
                        <label class="form-label small fw-bold text-success"><i class="bi bi-ticket-perforated"></i> Voucher</label>
                        <select v-model="orderInfo.voucher_code" class="form-select form-select-sm">
                            <option value="">-- Không sử dụng --</option>
                            <option v-for="v in availableVouchers" :key="v.code" :value="v.code">
                                {{ v.code }} - Giảm {{ formatCurrency(v.discount_value) }}
                            </option>
                        </select>
                    </div>

                    <div class="d-flex justify-content-between mb-2 small">
                        <span>Tạm tính:</span>
                        <span>{{ formatCurrency(product.price) }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 small">
                        <span>Phí vận chuyển:</span>
                        <span>{{ formatCurrency(orderInfo.shipment_fee) }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 small text-success" v-if="selectedVoucherDiscount > 0">
                        <span>Giảm giá:</span>
                        <span>- {{ formatCurrency(selectedVoucherDiscount) }}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold fs-5 text-primary">
                        <span>Tổng cộng:</span>
                        <span>{{ formatCurrency(finalTotal) }}</span>
                    </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" @click="placeOrder" class="btn btn-success fw-bold px-4">
                <i class="bi bi-check-circle me-2"></i> Đặt Hàng
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { cartActions } from '../services/cart';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal logic

const route = useRoute();
const product = ref(null);
const user = JSON.parse(localStorage.getItem('user') || '{}');
const vouchers = ref([]);
let modalInstance = null;

// Form data cho đơn hàng
const orderInfo = reactive({
    recipient_name: user.fname ? `${user.fname} ${user.lname}` : '',
    phone: user.phone || '',
    recipient_address: '',
    payment_method: 'CASH',
    voucher_code: '',
    shipment_fee: 30000 // Fix cứng phí ship demo
});

// Format tiền tệ
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

// Lấy thông tin sản phẩm
onMounted(async () => {
  const id = route.params.id;
  const res = await api.getProduct(id);
  if (res.data.success) product.value = res.data.data;
  
  // Lấy Voucher
  try {
      const vRes = await api.getVouchers();
      if(vRes.data.success) vouchers.value = vRes.data.data;
  } catch(e) { console.error(e); }
});

// Logic tính toán Voucher khả dụng (Giá SP phải > min_value của voucher)
const availableVouchers = computed(() => {
    if(!product.value) return [];
    return vouchers.value.filter(v => product.value.price >= v.min_value);
});

// Lấy giá trị giảm giá của voucher đang chọn
const selectedVoucherDiscount = computed(() => {
    const selected = vouchers.value.find(v => v.code === orderInfo.voucher_code);
    return selected ? selected.discount_value : 0;
});

// Tính tổng tiền cuối cùng
const finalTotal = computed(() => {
    if(!product.value) return 0;
    let total = product.value.price + orderInfo.shipment_fee - selectedVoucherDiscount.value;
    return total > 0 ? total : 0;
});

// Mở Modal
const openBuyNowModal = () => {
    if(!localStorage.getItem('user')) {
        alert("Vui lòng đăng nhập để mua hàng!");
        window.location.href = '/login';
        return;
    }
    const modalEl = document.getElementById('buyNowModal');
    modalInstance = new Modal(modalEl);
    modalInstance.show();
};

// Gửi đơn hàng
const placeOrder = async () => {
    if (!orderInfo.recipient_name || !orderInfo.phone || !orderInfo.recipient_address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    try {
        const payload = {
            customer_id: user.customer_id || 'CUS0001', // Demo ID nếu user chưa có
            product_id: product.value.product_id,
            quantity: 1, // Mua ngay mặc định số lượng 1
            unit_price: product.value.price,
            ...orderInfo
        };

        const res = await api.createOrder(payload);
        if(res.data.success) {
            alert(`Đặt hàng thành công! Mã đơn: #${res.data.order_id}`);
            modalInstance.hide();
            // Reset form hoặc reload trang
            orderInfo.voucher_code = '';
        }
    } catch (e) {
        alert("Lỗi đặt hàng: " + (e.response?.data?.error || e.message));
    }
};
</script>