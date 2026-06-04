package com.smartpizza.dto.response;

import lombok.*;

import java.util.List;

/**
 * Operational route/assignment optimization. With no GPS data, the strategy is
 * workload-based: recommend the available partner with the fewest ACTIVE deliveries.
 * estimatedTravelMinutes is a flat, honest estimate.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerRecommendationResponse {
    private Long recommendedPartnerId;
    private String recommendedPartnerName;
    private Integer recommendedActiveDeliveries;
    private int estimatedTravelMinutes;
    private List<PartnerWorkload> candidates;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PartnerWorkload {
        private Long partnerId;
        private String name;
        private String email;
        private int activeDeliveries;
        private boolean recommended;
    }
}
