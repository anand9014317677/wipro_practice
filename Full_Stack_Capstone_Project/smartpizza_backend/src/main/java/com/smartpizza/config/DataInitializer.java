package com.smartpizza.config;

import com.smartpizza.entity.Role;
import com.smartpizza.entity.User;
import com.smartpizza.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default ADMIN and DELIVERY accounts on startup so the app is usable
 * immediately for demos. Customers register themselves via /api/v1/auth/register.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seed("admin@smartpizza.ai", "Admin User", Role.ADMIN, "admin123");
        seed("delivery@smartpizza.ai", "Delivery Partner", Role.DELIVERY, "delivery123");
    }

    private void seed(String email, String name, Role role, String rawPassword) {
        if (!userRepository.existsByEmail(email)) {
            userRepository.save(User.builder()
                    .fullName(name)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .enabled(true)
                    .build());
            log.info("Seeded {} account: {}", role, email);
        }
    }
}
