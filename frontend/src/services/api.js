import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// PRODUCTS
export const getAllProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const searchProducts = (q) => API.get(`/products/search?q=${q}`);
export const getTopProducts = () => API.get('/products/top');
export const getProductsByCategory = (catId) => API.get(`/products/category/${catId}`);

// CART
export const getCart = (userId) => API.get(`/cart/${userId}`);
export const addToCartAPI = (userId, productId) => API.post('/cart/add', { userId, productId });
export const removeFromCartAPI = (cartId) => API.delete(`/cart/remove/${cartId}`);

// ORDERS
export const checkout = (data) => API.post('/orders/checkout', data);
export const getOrders = (userId) => API.get(`/orders/${userId}`);

// RECOMMENDATIONS
export const getRecommendations = (userId) => API.get(`/recommendations/${userId}`);
export const getAlsoBought = (productId) => API.get(`/recommendations/also-bought/${productId}`);

// CHATBOT
export const sendChatMessage = (message) => API.post('/chatbot/message', { message });

export default API;
