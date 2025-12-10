<!-- <template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-custom-blue sticky-top">
    <div class="container">
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link btn btn-outline-light px-3 border-0" to="/login">
              <i class="bi bi-person-circle me-1"></i> Đăng nhập
            </router-link>
          </li>

          <li class="nav-item dropdown" v-else>
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              id="userDropdown" 
              role="button"
              @click.prevent="toggleDropdown" 
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-2"></i>
              Xin chào, {{ user?.fname || 'User' }}
            </a>

            <ul 
              class="dropdown-menu dropdown-menu-end" 
              :class="{ show: isOpen }" 
              aria-labelledby="userDropdown"
            >
              <li>
                <span class="dropdown-item-text text-muted small">
                  Vai trò: <strong class="text-primary">{{ user?.role || 'sManager' }}</strong>
                </span>
              </li>
              
              <li>
                 <router-link class="dropdown-item" to="/seller" @click="closeDropdown">
                   <i class="bi bi-shop me-2 text-primary"></i> Kênh người bán
                 </router-link>
              </li>
              
              <li v-if="user?.role === 'ADMIN'">
                 <router-link class="dropdown-item" to="/admin" @click="closeDropdown">
                   <i class="bi bi-speedometer2 me-2 text-warning"></i> Quản trị viên
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { cartState } from '../services/cart'; 

const isLoggedIn = ref(false);
const user = ref(null);
const router = useRouter();

// --- LOGIC MỚI: TỰ QUẢN LÝ DROPDOWN ---
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value; // Bấm thì mở, bấm lại thì đóng
};

const closeDropdown = () => {
  isOpen.value = false; // Chọn xong thì đóng lại
};
// -------------------------------------

const cartCount = computed(() => {
  return cartState.items ? cartState.items.length : 0;
});

const checkLogin = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      isLoggedIn.value = true;
    } catch (e) {
      logout();
    }
  }
};

const logout = () => {
  closeDropdown(); // Đóng menu trước khi logout
  localStorage.removeItem('user');
  window.location.href = '/login'; 
};

onMounted(checkLogin);
</script> -->

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-custom-blue sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-cart4"></i> C2C Market
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          
          <!-- <li class="nav-item me-3">
            <router-link to="/cart" class="position-relative text-white text-decoration-none">
              <i class="bi bi-cart3 fs-4"></i>
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7rem;">
                {{ cartCount }}
              </span>
            </router-link>
          </li> -->

          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link btn btn-outline-light px-3 border-0" to="/login">
              <i class="bi bi-person-circle me-1"></i> Đăng nhập
            </router-link>
          </li>

          <li class="nav-item dropdown" v-else>
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              id="userDropdown" 
              role="button"
              @click.prevent="toggleDropdown" 
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-2"></i>
              Xin chào, {{ user?.fname || 'User' }}
            </a>

            <ul 
              class="dropdown-menu dropdown-menu-end" 
              :class="{ show: isOpen }" 
              aria-labelledby="userDropdown"
            >
              <li>
                <span class="dropdown-item-text text-muted small">
                  Vai trò: <strong class="text-primary">{{ user?.role || 'Khách' }}</strong>
                </span>
              </li>
              
              <li>
                 <router-link class="dropdown-item" to="/seller" @click="closeDropdown">
                   <i class="bi bi-shop me-2 text-primary"></i> Kênh người bán
                 </router-link>
              </li>
              
              <li v-if="user?.role === 'ADMIN'">
                 <router-link class="dropdown-item" to="/admin" @click="closeDropdown">
                   <i class="bi bi-speedometer2 me-2 text-warning"></i> Quản trị viên
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { cartState } from '../services/cart'; 

const isLoggedIn = ref(false);
const user = ref(null);
const isOpen = ref(false); // Biến kiểm soát menu

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const cartCount = computed(() => {
  return cartState.items ? cartState.items.length : 0;
});

const checkLogin = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      isLoggedIn.value = true;
    } catch (e) {
      logout();
    }
  }
};

const logout = () => {
  closeDropdown();
  localStorage.removeItem('user');
  window.location.href = '/login'; 
};

onMounted(checkLogin);
</script>