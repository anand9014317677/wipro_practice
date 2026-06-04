import apiClient from '../api/axiosClient';

export const recommendationService = {
  getRecommendations: (limit = 12) =>
    apiClient.get('/recommendations', { params: { limit } }).then((res) => res.data),
  getTrending: (limit = 12) =>
    apiClient.get('/recommendations/trending', { params: { limit } }).then((res) => res.data),
  getHistoryBased: (limit = 12) =>
    apiClient.get('/recommendations/history-based', { params: { limit } }).then((res) => res.data),
  getCategoryBased: (limit = 12) =>
    apiClient.get('/recommendations/category-based', { params: { limit } }).then((res) => res.data),
};
