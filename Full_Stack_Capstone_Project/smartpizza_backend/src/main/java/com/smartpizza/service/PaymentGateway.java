package com.smartpizza.service;

import java.math.BigDecimal;

/**
 * Abstraction over a payment provider. Swap the implementation to integrate a
 * real gateway (Razorpay / Stripe) without touching PaymentService:
 * add a class implementing this interface and mark it @Primary (or select via
 * a config property). The current MockPaymentGateway simulates the flow.
 */
public interface PaymentGateway {

    String getProvider();

    GatewayOrder createOrder(BigDecimal amount, String currency, String receipt);

    boolean verify(String gatewayOrderId, String transactionId, String signature);

    String refund(String transactionId, BigDecimal amount);

    record GatewayOrder(String gatewayOrderId, String provider) {
    }
}
