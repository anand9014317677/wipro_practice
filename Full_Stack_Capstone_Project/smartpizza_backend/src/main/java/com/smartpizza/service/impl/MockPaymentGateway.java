package com.smartpizza.service.impl;

import com.smartpizza.service.PaymentGateway;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Development gateway that simulates create / verify / refund so the whole
 * payment flow is runnable without external credentials. Replace with a real
 * Razorpay/Stripe implementation for production.
 */
@Service
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public String getProvider() {
        return "MOCK";
    }

    @Override
    public GatewayOrder createOrder(BigDecimal amount, String currency, String receipt) {
        return new GatewayOrder("mock_order_" + shortId(), getProvider());
    }

    @Override
    public boolean verify(String gatewayOrderId, String transactionId, String signature) {
        // Simulated rule: any non-blank transactionId means success.
        // Send transactionId = "fail" to simulate a failed verification.
        return transactionId != null
                && !transactionId.isBlank()
                && !transactionId.equalsIgnoreCase("fail");
    }

    @Override
    public String refund(String transactionId, BigDecimal amount) {
        return "mock_refund_" + shortId();
    }

    private String shortId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}
