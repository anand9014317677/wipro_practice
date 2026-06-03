package com.example.user.exception;



public class AadharAlreadyExistsException extends RuntimeException {

    public AadharAlreadyExistsException(String message) {
        super(message);
    }
}