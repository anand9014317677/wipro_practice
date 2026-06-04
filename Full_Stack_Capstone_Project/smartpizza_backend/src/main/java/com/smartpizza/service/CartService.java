package com.smartpizza.service;

import com.smartpizza.dto.request.AddToCartRequest;
import com.smartpizza.dto.request.UpdateCartItemRequest;
import com.smartpizza.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(String userEmail);

    CartResponse addToCart(String userEmail, AddToCartRequest request);

    CartResponse updateItem(String userEmail, UpdateCartItemRequest request);

    CartResponse removeItem(String userEmail, Long cartItemId);

    CartResponse clearCart(String userEmail);
}
