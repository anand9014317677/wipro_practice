package com.smartpizza.service.impl;

import com.smartpizza.dto.request.AddToCartRequest;
import com.smartpizza.dto.request.UpdateCartItemRequest;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.entity.Cart;
import com.smartpizza.entity.CartItem;
import com.smartpizza.entity.Pizza;
import com.smartpizza.entity.User;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.CartMapper;
import com.smartpizza.repository.CartItemRepository;
import com.smartpizza.repository.CartRepository;
import com.smartpizza.repository.PizzaRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PizzaRepository pizzaRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse getCart(String userEmail) {
        return cartMapper.toResponse(getOrCreateCart(userEmail));
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userEmail, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Pizza pizza = pizzaRepository.findById(request.getPizzaId())
                .orElseThrow(() -> new ResourceNotFoundException("Pizza", "id", request.getPizzaId()));
        if (!pizza.isAvailable()) {
            throw new BadRequestException("This pizza is currently unavailable");
        }

        CartItem existing = cartItemRepository
                .findByCartIdAndPizzaId(cart.getId(), pizza.getId())
                .orElse(null);

        if (existing == null) {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .pizza(pizza)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        } else {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
        }

        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(String userEmail, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = findItemInCart(cart, request.getCartItemId());
        item.setQuantity(request.getQuantity());
        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = findItemInCart(cart, cartItemId);
        cart.getItems().remove(item); // orphanRemoval deletes the row
        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartItem findItemInCart(Cart cart, Long cartItemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));
    }
}
