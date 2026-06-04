import apiClient from '../api/axiosClient';

/**
 * Cart API. The backend returns the full cart on every mutation:
 * { id, items: [...], totalItems, subtotal }.
 */
export const cartService = {
  getCart: () => apiClient.get('/cart').then((res) => res.data),

  addToCart: (payload) => apiClient.post('/cart/add', payload).then((res) => res.data),

  updateItem: (payload) => apiClient.put('/cart/update', payload).then((res) => res.data),

  removeItem: (cartItemId) =>
    apiClient.delete(`/cart/remove/${cartItemId}`).then((res) => res.data),

  clearCart: () => apiClient.delete('/cart/clear').then((res) => res.data),
};
