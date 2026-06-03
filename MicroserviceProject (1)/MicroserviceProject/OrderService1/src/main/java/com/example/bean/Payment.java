package com.example.bean;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Remove the JPA annotations because we don't want to save in the database through repository because it's like a DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    // Here we are using only for getter and setter methods

    int paymentId;
    String paymentStatus;
    String transactionId;
    int orderId;
    double amount;

}
