<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-custom-blue sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-cart4"></i> C2C Market
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#mainNavbar" 
        aria-controls="mainNavbar" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link btn btn-outline-light px-3 border-0" to="/login">
              <i class="bi bi-person-circle me-1"></i> Đăng nhập
            </router-link>
          </li>

          <li class="nav-item dropdown" v-else>
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Xin chào, {{ user?.fname || 'User' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                 <router-link class="dropdown-item" to="/seller">
                   <i class="bi bi-shop me-2"></i> Kênh người bán
                 </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                  <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(false);
const user = ref(null);
const router = useRouter();

const checkLogin = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    isLoggedIn.value = true;
    user.value = JSON.parse(storedUser);
  }
};

const logout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  router.push('/login');
};

onMounted(checkLogin);
</script>

<style scoped>
/* CSS để nút toggler trông đẹp hơn */
.navbar-toggler {
  border: none;
}
.navbar-toggler:focus {
  box-shadow: none;
}
</style>