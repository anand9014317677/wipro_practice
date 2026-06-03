package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.bean.Order;
import com.example.bean.Payment;
import com.example.dto.OrderRequest;
import com.example.dto.OrderResponse;
import com.example.repo.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository repo;

    public OrderResponse placeOrder(OrderRequest orderRequest) {

        Order order = orderRequest.getOrder();

        repo.save(order);

        Payment payment = new Payment();
        payment.setOrderId(order.getId());
        payment.setAmount(order.getPrice() * order.getQty());

        Payment paymentResponse = restTemplate.postForObject(
                "http://PAYMENTSERVICE/payment/doPayment",
                payment,
                Payment.class
        );

        return new OrderResponse(
                order,
                paymentResponse.getPaymentStatus(),
                paymentResponse.getTransactionId(),
                paymentResponse.getAmount()
        );
    }
}