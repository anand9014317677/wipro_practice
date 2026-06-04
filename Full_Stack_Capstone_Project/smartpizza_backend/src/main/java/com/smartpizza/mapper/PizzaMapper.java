package com.smartpizza.mapper;

import com.smartpizza.dto.request.PizzaRequest;
import com.smartpizza.dto.response.PizzaResponse;
import com.smartpizza.entity.Category;
import com.smartpizza.entity.Pizza;
import org.springframework.stereotype.Component;

@Component
public class PizzaMapper {

    public Pizza toEntity(PizzaRequest request, Category category) {
        return Pizza.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .size(request.getSize())
                .veg(Boolean.TRUE.equals(request.getVeg()))
                .imageUrl(request.getImageUrl())
                .rating(0.0)
                .available(request.getAvailable() == null || request.getAvailable())
                .category(category)
                .build();
    }

    public void updateEntity(Pizza pizza, PizzaRequest request, Category category) {
        pizza.setName(request.getName());
        pizza.setDescription(request.getDescription());
        pizza.setPrice(request.getPrice());
        pizza.setSize(request.getSize());
        pizza.setVeg(Boolean.TRUE.equals(request.getVeg()));
        pizza.setImageUrl(request.getImageUrl());
        if (request.getAvailable() != null) {
            pizza.setAvailable(request.getAvailable());
        }
        pizza.setCategory(category);
    }

    public PizzaResponse toResponse(Pizza pizza) {
        if (pizza == null) {
            return null;
        }
        return PizzaResponse.builder()
                .id(pizza.getId())
                .name(pizza.getName())
                .description(pizza.getDescription())
                .price(pizza.getPrice())
                .size(pizza.getSize() != null ? pizza.getSize().name() : null)
                .veg(pizza.isVeg())
                .imageUrl(pizza.getImageUrl())
                .rating(pizza.getRating())
                .available(pizza.isAvailable())
                .categoryId(pizza.getCategory() != null ? pizza.getCategory().getId() : null)
                .categoryName(pizza.getCategory() != null ? pizza.getCategory().getName() : null)
                .createdAt(pizza.getCreatedAt())
                .updatedAt(pizza.getUpdatedAt())
                .build();
    }
}
