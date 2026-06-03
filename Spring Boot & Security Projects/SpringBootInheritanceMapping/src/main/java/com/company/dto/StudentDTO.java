package com.company.dto;

import java.util.List;

public record StudentDTO(

        Long id,
        String name,
        String city,
        List<String> emails

) {
}