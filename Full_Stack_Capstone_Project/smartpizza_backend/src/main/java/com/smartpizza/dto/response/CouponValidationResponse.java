package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;

/**
 * Doubles as a billing quote (subtotal/GST/delivery/discount/grandTotal) and a
 * coupon validation result. All amounts are server-computed for a single source of truth.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponValidationResponse {
    private boolean valid;
    private String couponCode;
    private BigDecimal subtotal;
    private BigDecimal gstAmount;
    private BigDecimal deliveryFee;
    private BigDecimal discountAmount;
    private BigDecimal grandTotal;
    private String message;
}
