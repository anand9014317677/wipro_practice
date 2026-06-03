package com.example.service;

import com.example.bean.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "PAYMENTSERVICE")
public interface PaymentFeignClient {

    @PostMapping("/payment")
    public Payment doPayment(@RequestBody Payment payment);

}