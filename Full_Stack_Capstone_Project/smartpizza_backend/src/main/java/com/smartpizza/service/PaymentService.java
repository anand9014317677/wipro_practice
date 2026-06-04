package com.smartpizza.service;

import com.smartpizza.dto.request.CreatePaymentRequest;
import com.smartpizza.dto.request.RefundRequest;
import com.smartpizza.dto.request.VerifyPaymentRequest;
import com.smartpizza.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(String userEmail, CreatePaymentRequest request);

    PaymentResponse verifyPayment(String userEmail, VerifyPaymentRequest request);

    List<PaymentResponse> getHistory(String userEmail);

    PaymentResponse getById(String userEmail, Long paymentId);

    PaymentResponse refund(String userEmail, Long paymentId, RefundRequest request);
}
