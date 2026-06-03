package com.example.controller;



import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.security.JwtUtil;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginRequest) {

        Optional<User> optionalUser =
                userRepository.findByUsername(
                        loginRequest.getUsername());

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            if (passwordEncoder.matches(
                    loginRequest.getPassword(),
                    user.getPassword())) {

                String token =
                        jwtUtil.generateToken(
                                user.getRole());

                Map<String, String> response =
                        new HashMap<>();

                response.put("token", token);

                response.put("role",
                        user.getRole());

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody User user) {

        Optional<User> existing =
                userRepository.findByUsername(
                        user.getUsername());

        if (existing.isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()));

        if (user.getRole() == null
                || user.getRole().isBlank()) {

            user.setRole("USER");
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                "User registered successfully");
    }
}