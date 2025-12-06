import { createRouter, createWebHistory } from 'vue-router'

// Import các components (Views)
import HomePage from '../views/HomePage.vue'
import SellerDashboard from '../views/SellerDashboard.vue'
import ProductDetail from '../views/ProductDetail.vue'
import LoginPage from '../views/LoginPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/seller',
    name: 'Seller',
    component: SellerDashboard
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router