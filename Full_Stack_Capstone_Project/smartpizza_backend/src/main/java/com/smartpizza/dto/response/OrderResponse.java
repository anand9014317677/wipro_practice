package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String status;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;   // grand total (kept for backward compatibility)
    private BigDecimal gstAmount;     // alias of tax (GST)
    private BigDecimal discountAmount;
    private BigDecimal grandTotal;    // = totalAmount
    private String couponCode;
    private String deliveryAddress;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Instant createdAt;
    private Instant updatedAt;
    private Integer estimatedMinutesRemaining; // heuristic ETA (null/0 when delivered/cancelled)
    private Instant estimatedDeliveryTime;     // now + estimatedMinutesRemaining
}
