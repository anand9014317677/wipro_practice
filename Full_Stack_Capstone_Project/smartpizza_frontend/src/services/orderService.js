import apiClient from '../api/axiosClient';

export const orderService = {
  placeOrder: (payload) => apiClient.post('/orders', payload).then((res) => res.data),
  getMyOrders: () => apiClient.get('/orders/my-orders').then((res) => res.data),
  getOrderById: (id) => apiClient.get(`/orders/${id}`).then((res) => res.data),
  trackOrder: (id) => apiClient.get(`/orders/track/${id}`).then((res) => res.data),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`).then((res) => res.data),
  reorder: (id) => apiClient.post(`/orders/${id}/reorder`).then((res) => res.data),
};
