package com.smartpizza.controller;

import com.smartpizza.dto.request.AddToCartRequest;
import com.smartpizza.dto.request.UpdateCartItemRequest;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Cart", description = "Shopping cart for the authenticated user")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "View the current user's cart")
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getUsername()));
    }

    @PostMapping("/add")
    @Operation(summary = "Add a pizza to the cart (increments quantity if already present)")
    public ResponseEntity<CartResponse> add(@AuthenticationPrincipal UserDetails principal,
                                            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(principal.getUsername(), request));
    }

    @PutMapping("/update")
    @Operation(summary = "Set the quantity of an existing cart item")
    public ResponseEntity<CartResponse> update(@AuthenticationPrincipal UserDetails principal,
                                               @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(principal.getUsername(), request));
    }

    @DeleteMapping("/remove/{id}")
    @Operation(summary = "Remove a single item from the cart by cart item id")
    public ResponseEntity<CartResponse> remove(@AuthenticationPrincipal UserDetails principal,
                                               @PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItem(principal.getUsername(), id));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Remove all items from the cart")
    public ResponseEntity<CartResponse> clear(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(cartService.clearCart(principal.getUsername()));
    }
}
