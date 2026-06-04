package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private String receiptNumber;
    private Long orderId;
    private String status;
    private String method;
    private String currency;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private String couponCode;
    private BigDecimal refundedAmount;
    private String transactionId;
    private String gatewayOrderId;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Instant createdAt;
    private Instant paidAt;
    private Instant refundedAt;
}
