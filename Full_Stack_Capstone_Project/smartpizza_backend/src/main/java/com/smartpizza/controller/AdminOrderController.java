package com.smartpizza.controller;

import com.smartpizza.dto.response.OrderResponse;
import com.smartpizza.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-driven kitchen workflow. All endpoints are ADMIN-only (also enforced by
 * SecurityConfig's /api/v1/admin/** rule). These are ADDITIVE — the existing
 * customer order endpoints under /api/v1/orders are unchanged.
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin · Orders", description = "Kitchen workflow (admin only)")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List all orders, optionally filtered by status")
    public ResponseEntity<List<OrderResponse>> list(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.listAllOrders(status));
    }

    @PutMapping("/{id}/accept")
    @Operation(summary = "Accept an order (PLACED/CONFIRMED -> ACCEPTED)")
    public ResponseEntity<OrderResponse> accept(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.adminAccept(id));
    }

    @PutMapping("/{id}/preparing")
    @Operation(summary = "Mark an order PREPARING (ACCEPTED -> PREPARING)")
    public ResponseEntity<OrderResponse> preparing(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.adminMarkPreparing(id));
    }

    @PutMapping("/{id}/baked")
    @Operation(summary = "Mark an order BAKED (PREPARING -> BAKED)")
    public ResponseEntity<OrderResponse> baked(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.adminMarkBaked(id));
    }
}
