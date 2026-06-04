import apiClient from '../api/axiosClient';

/**
 * Pizza catalogue API. List/search return a PageResponse:
 * { content, page, size, totalElements, totalPages, first, last }.
 * Create/update/delete are ADMIN-only on the backend.
 */
export const pizzaService = {
  getPizzas: (params = {}) => apiClient.get('/pizzas', { params }).then((res) => res.data),
  searchPizzas: (params = {}) => apiClient.get('/pizzas/search', { params }).then((res) => res.data),
  getPizzaById: (id) => apiClient.get(`/pizzas/${id}`).then((res) => res.data),

  createPizza: (payload) => apiClient.post('/pizzas', payload).then((res) => res.data),
  updatePizza: (id, payload) => apiClient.put(`/pizzas/${id}`, payload).then((res) => res.data),
  deletePizza: (id) => apiClient.delete(`/pizzas/${id}`).then((res) => res.data),
};
