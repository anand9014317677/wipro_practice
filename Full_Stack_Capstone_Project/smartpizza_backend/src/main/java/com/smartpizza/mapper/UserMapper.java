package com.smartpizza.mapper;

import com.smartpizza.dto.response.UserResponse;
import com.smartpizza.entity.User;
import org.springframework.stereotype.Component;

/**
 * Converts entities to DTOs so internal data (e.g. password hashes) never
 * leaves the service layer. Kept as a plain component for readability;
 * can be swapped for MapStruct later without changing call sites.
 */
@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }
}
