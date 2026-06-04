import apiClient from '../api/axiosClient';

/** Category API. Create/update/delete are ADMIN-only on the backend. */
export const categoryService = {
  getCategories: () => apiClient.get('/categories').then((res) => res.data),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`).then((res) => res.data),

  createCategory: (payload) => apiClient.post('/categories', payload).then((res) => res.data),
  updateCategory: (id, payload) => apiClient.put(`/categories/${id}`, payload).then((res) => res.data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`).then((res) => res.data),
};
