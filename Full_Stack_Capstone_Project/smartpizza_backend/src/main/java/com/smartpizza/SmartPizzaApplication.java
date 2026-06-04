package com.smartpizza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartPizzaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartPizzaApplication.class, args);
    }
}
