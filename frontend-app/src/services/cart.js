import { reactive } from 'vue';

const CART_KEY = 'c2c_cart';
// Lấy dữ liệu từ LocalStorage nếu có, không thì là mảng rỗng
const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

export const cartState = reactive({
  items: storedCart
});

export const cartActions = {
  add(product) {
    const existing = cartState.items.find(item => item.product_id === product.product_id);
    if (existing) {
      existing.quantity++;
    } else {
      cartState.items.push({ ...product, quantity: 1 });
    }
    this.save();
  },
  remove(id) {
    cartState.items = cartState.items.filter(item => item.product_id !== id);
    this.save();
  },
  clear() {
    cartState.items = [];
    this.save();
  },
  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartState.items));
  },
  total() {
    return cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};