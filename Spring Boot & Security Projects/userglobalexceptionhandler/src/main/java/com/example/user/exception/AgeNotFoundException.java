package com.example.user.exception;



public class AgeNotFoundException extends RuntimeException {

    public AgeNotFoundException(String message) {
        super(message);
    }
}