import apiClient from '../api/axiosClient';

/** Admin kitchen workflow (ADMIN only). Backend: /api/v1/admin/orders. */
export const adminOrderService = {
  listOrders: (status) =>
    apiClient.get('/admin/orders', { params: status ? { status } : {} }).then((res) => res.data),
  accept: (id) => apiClient.put(`/admin/orders/${id}/accept`).then((res) => res.data),
  preparing: (id) => apiClient.put(`/admin/orders/${id}/preparing`).then((res) => res.data),
  baked: (id) => apiClient.put(`/admin/orders/${id}/baked`).then((res) => res.data),
};
