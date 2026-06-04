package com.smartpizza.controller;

import com.smartpizza.dto.request.PlaceOrderRequest;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.dto.response.OrderResponse;
import com.smartpizza.dto.response.OrderTrackResponse;
import com.smartpizza.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders", description = "Place, track, cancel and reorder orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place an order from the current user's cart")
    public ResponseEntity<OrderResponse> placeOrder(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody(required = false) PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(principal.getUsername(), request));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "List the current user's orders, newest first")
    public ResponseEntity<List<OrderResponse>> myOrders(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single order by id (owner or ADMIN)")
    public ResponseEntity<OrderResponse> getById(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(principal.getUsername(), id));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order (only while PLACED or CONFIRMED)")
    public ResponseEntity<OrderResponse> cancel(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(principal.getUsername(), id));
    }

    @PostMapping("/{id}/reorder")
    @Operation(summary = "Add the items of a previous order back into the cart")
    public ResponseEntity<CartResponse> reorder(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.reorder(principal.getUsername(), id));
    }

    @GetMapping("/track/{id}")
    @Operation(summary = "Track an order: current status + full status timeline")
    public ResponseEntity<OrderTrackResponse> track(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.trackOrder(principal.getUsername(), id));
    }
}
