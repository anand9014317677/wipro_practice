package com.example.user.exception;



public class PanAlreadyExistsException extends RuntimeException {

    public PanAlreadyExistsException(String message) {
        super(message);
    }
}