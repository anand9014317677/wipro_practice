package com.smartpizza.repository;

import com.smartpizza.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndPizzaId(Long cartId, Long pizzaId);
}
