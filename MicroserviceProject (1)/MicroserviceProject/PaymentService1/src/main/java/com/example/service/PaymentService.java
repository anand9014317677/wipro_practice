package com.example.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bean.Payment;
import com.example.repo.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment doPayment(Payment payment) {

        payment.setPaymentStatus("SUCCESS");

        payment.setTransactionId(UUID.randomUUID().toString());

        return paymentRepository.save(payment);
    }
}