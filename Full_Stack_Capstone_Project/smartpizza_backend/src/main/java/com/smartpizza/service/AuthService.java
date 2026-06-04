package com.smartpizza.service;

import com.smartpizza.dto.request.LoginRequest;
import com.smartpizza.dto.request.RegisterRequest;
import com.smartpizza.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
