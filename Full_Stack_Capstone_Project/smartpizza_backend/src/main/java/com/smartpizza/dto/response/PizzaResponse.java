package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PizzaResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String size;
    private boolean veg;
    private String imageUrl;
    private Double rating;
    private boolean available;
    private Long categoryId;
    private String categoryName;
    private Instant createdAt;
    private Instant updatedAt;
}
