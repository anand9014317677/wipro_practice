package com.example.dto;

import com.example.bean.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Order order;
    private String paymentStatus;
    private String transactionId;
    private double amount;

}