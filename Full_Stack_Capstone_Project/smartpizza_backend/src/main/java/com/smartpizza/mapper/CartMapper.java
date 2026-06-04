package com.smartpizza.mapper;

import com.smartpizza.dto.response.CartItemResponse;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.entity.Cart;
import com.smartpizza.entity.CartItem;
import com.smartpizza.entity.Pizza;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CartMapper {

    public CartItemResponse toItemResponse(CartItem item) {
        Pizza pizza = item.getPizza();
        BigDecimal unitPrice = pizza.getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .pizzaId(pizza.getId())
                .pizzaName(pizza.getName())
                .imageUrl(pizza.getImageUrl())
                .size(pizza.getSize() != null ? pizza.getSize().name() : null)
                .veg(pizza.isVeg())
                .unitPrice(unitPrice)
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .build();
    }

    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::toItemResponse)
                .toList();
        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();
        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }
}
