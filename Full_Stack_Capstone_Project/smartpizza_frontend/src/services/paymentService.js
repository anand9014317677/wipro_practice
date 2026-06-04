import apiClient from '../api/axiosClient';

export const paymentService = {
  createPayment: (payload) => apiClient.post('/payments/create', payload).then((res) => res.data),
  verifyPayment: (payload) => apiClient.post('/payments/verify', payload).then((res) => res.data),
  getHistory: () => apiClient.get('/payments/history').then((res) => res.data),
  getById: (id) => apiClient.get(`/payments/${id}`).then((res) => res.data),
  getInvoice: (orderId) =>
    apiClient.get(`/payments/invoice/${orderId}`, { responseType: 'blob' }).then((res) => res.data),
};
