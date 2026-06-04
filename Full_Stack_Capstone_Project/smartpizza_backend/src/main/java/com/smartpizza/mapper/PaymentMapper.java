package com.smartpizza.mapper;

import com.smartpizza.dto.response.PaymentResponse;
import com.smartpizza.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .receiptNumber("RCPT-" + p.getId())
                .orderId(p.getOrder() != null ? p.getOrder().getId() : null)
                .status(p.getStatus().name())
                .method(p.getMethod().name())
                .currency(p.getCurrency())
                .subtotal(p.getSubtotal())
                .tax(p.getTax())
                .deliveryFee(p.getDeliveryFee())
                .totalAmount(p.getTotalAmount())
                .discountAmount(p.getDiscountAmount())
                .couponCode(p.getCouponCode())
                .refundedAmount(p.getRefundedAmount())
                .transactionId(p.getTransactionId())
                .gatewayOrderId(p.getGatewayOrderId())
                .customerId(p.getUser() != null ? p.getUser().getId() : null)
                .customerName(p.getUser() != null ? p.getUser().getFullName() : null)
                .customerEmail(p.getUser() != null ? p.getUser().getEmail() : null)
                .createdAt(p.getCreatedAt())
                .paidAt(p.getPaidAt())
                .refundedAt(p.getRefundedAt())
                .build();
    }
}
