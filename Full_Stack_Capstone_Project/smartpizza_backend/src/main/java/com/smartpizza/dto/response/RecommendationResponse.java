package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {
    private Long pizzaId;
    private String pizzaName;
    private String categoryName;
    private BigDecimal price;
    private Double rating;
    private boolean veg;
    private String imageUrl;
    /** 0–100 recommendation score. */
    private double score;
    /** Human-readable explanation of why this pizza was recommended. */
    private String reason;
}
