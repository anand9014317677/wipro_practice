package com.smartpizza.service;

import com.smartpizza.entity.Order;
import com.smartpizza.entity.Payment;

/**
 * Transactional emails. Implementations MUST be non-blocking and MUST NOT throw
 * into business flows — a mail failure can never roll back an order or payment.
 */
public interface EmailService {

    void sendOrderPlaced(Order order);

    void sendPaymentSuccess(Payment payment);

    void sendOrderDelivered(Order order);
}
