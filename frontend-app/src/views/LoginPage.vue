<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card p-4 shadow-sm">
          <h3 class="text-center text-primary mb-4">Đăng Nhập</h3>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label>Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="user@example.com" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
          </form>
          <div class="mt-3 text-center">
             <small class="text-muted">Demo: Nhập bất kỳ để vào</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();

const handleLogin = () => {
  // Demo login: Lưu user giả vào LocalStorage
  const fakeUser = {
    email: email.value,
    fname: 'Người Dùng', // Tên giả định
    role: 'Seller'
  };
  localStorage.setItem('user', JSON.stringify(fakeUser));
  
  // Chuyển hướng về trang chủ
  // Dùng window.location.href để ép reload lại NavBar cập nhật trạng thái
  window.location.href = '/'; 
};
</script>