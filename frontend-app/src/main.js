import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 1. Import CSS Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// 2. QUAN TRỌNG: Import JS Bootstrap (để menu hoạt động được trên mobile)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 3. Import CSS của bạn
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')