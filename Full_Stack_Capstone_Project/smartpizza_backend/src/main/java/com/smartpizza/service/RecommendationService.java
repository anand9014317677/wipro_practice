package com.smartpizza.service;

import com.smartpizza.dto.response.RecommendationResponse;

import java.util.List;

public interface RecommendationService {

    /** Personalized recommendations; falls back to trending for new customers. */
    List<RecommendationResponse> recommend(String userEmail, int limit);

    /** Global trending: most ordered + highest rated. */
    List<RecommendationResponse> trending(int limit);

    /** Recommendations derived from the user's full order history. */
    List<RecommendationResponse> historyBased(String userEmail, int limit);

    /** Recommendations from the user's favourite categories. */
    List<RecommendationResponse> categoryBased(String userEmail, int limit);
}
