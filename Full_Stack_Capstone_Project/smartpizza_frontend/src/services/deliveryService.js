import apiClient from '../api/axiosClient';

export const deliveryService = {
  getDeliveries: () => apiClient.get('/delivery/orders').then((res) => res.data),
  getById: (id) => apiClient.get(`/delivery/${id}`).then((res) => res.data),
  accept: (id) => apiClient.put(`/delivery/${id}/accept`).then((res) => res.data),
  reject: (id, reason) =>
    apiClient.put(`/delivery/${id}/reject`, null, { params: reason ? { reason } : {} }).then((res) => res.data),
  preparing: (id) => apiClient.put(`/delivery/${id}/preparing`).then((res) => res.data),
  baked: (id) => apiClient.put(`/delivery/${id}/baked`).then((res) => res.data),
  readyToPickup: (id) => apiClient.put(`/delivery/${id}/ready-to-pickup`).then((res) => res.data),
  outForDelivery: (id) => apiClient.put(`/delivery/${id}/out-for-delivery`).then((res) => res.data),
  delivered: (id) => apiClient.put(`/delivery/${id}/delivered`).then((res) => res.data),
  collectCash: (id) => apiClient.put(`/delivery/${id}/collect-cash`).then((res) => res.data),
  track: (orderId) => apiClient.get(`/delivery/track/${orderId}`).then((res) => res.data),
  assign: (payload) => apiClient.post('/delivery/assign', payload).then((res) => res.data),
  getRecommendedPartner: () => apiClient.get('/delivery/recommended-partner').then((res) => res.data),
};
