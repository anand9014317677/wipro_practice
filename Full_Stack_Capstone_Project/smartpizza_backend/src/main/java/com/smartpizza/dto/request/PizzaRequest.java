package com.smartpizza.dto.request;

import com.smartpizza.entity.PizzaSize;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PizzaRequest {

    @NotBlank(message = "Pizza name is required")
    @Size(min = 2, max = 150, message = "Pizza name must be between 2 and 150 characters")
    private String name;

    @Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 digits and 2 decimals")
    private BigDecimal price;

    @NotNull(message = "Size is required (SMALL, MEDIUM or LARGE)")
    private PizzaSize size;

    @NotNull(message = "Veg/non-veg flag is required")
    private Boolean veg;

    @Size(max = 500, message = "Image URL must be at most 500 characters")
    private String imageUrl;

    @NotNull(message = "Category id is required")
    @Positive(message = "Category id must be a positive number")
    private Long categoryId;

    /** Optional. Defaults to true on creation when not provided. */
    private Boolean available;
}
