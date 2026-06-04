package com.smartpizza.service;

import com.smartpizza.dto.response.PartnerRecommendationResponse;

public interface DeliveryOptimizationService {

    /** Recommend the best-available delivery partner based on current active workload. */
    PartnerRecommendationResponse recommend();
}
