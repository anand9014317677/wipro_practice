package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long pizzaId;
    private String pizzaName;
    private String size;
    private boolean veg;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
}
