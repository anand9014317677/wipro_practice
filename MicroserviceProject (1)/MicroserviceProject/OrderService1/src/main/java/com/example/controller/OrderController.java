package com.example.controller;

import com.example.bean.Order;
import com.example.dto.OrderRequest;
import com.example.dto.OrderResponse;
import com.example.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public OrderResponse placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }

    public OrderResponse paymentFallback(OrderRequest orderRequest, Throwable throwable) {

        Order order = orderRequest.getOrder();

        return new OrderResponse(
                order,
                "FAILED",
                "N/A",
                order.getPrice() * order.getQty()
        );
    }
}