package com.smartpizza.controller;

import com.smartpizza.dto.request.AssignDeliveryRequest;
import com.smartpizza.dto.response.DeliveryResponse;
import com.smartpizza.dto.response.PartnerRecommendationResponse;
import com.smartpizza.dto.response.DeliveryTrackResponse;
import com.smartpizza.entity.DeliveryStatus;
import com.smartpizza.service.DeliveryOptimizationService;
import com.smartpizza.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Delivery", description = "Assign, accept/reject, progress and track deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final DeliveryOptimizationService optimizationService;

    @GetMapping("/recommended-partner")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Recommend the best-available delivery partner (fewest active deliveries)")
    public ResponseEntity<PartnerRecommendationResponse> recommendedPartner() {
        return ResponseEntity.ok(optimizationService.recommend());
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign a CONFIRMED order to a delivery partner (ADMIN only)")
    public ResponseEntity<DeliveryResponse> assign(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody AssignDeliveryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliveryService.assign(principal.getUsername(), request));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyRole('ADMIN','DELIVERY')")
    @Operation(summary = "List deliveries (ADMIN: all; DELIVERY: own assignments)")
    public ResponseEntity<List<DeliveryResponse>> getOrders(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(deliveryService.getDeliveryOrders(principal.getUsername()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DELIVERY')")
    @Operation(summary = "Get a delivery assignment by id (ADMIN or the assigned partner)")
    public ResponseEntity<DeliveryResponse> getById(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getById(principal.getUsername(), id));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Accept an assigned delivery")
    public ResponseEntity<DeliveryResponse> accept(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.accept(principal.getUsername(), id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Reject an assigned delivery (optional reason)")
    public ResponseEntity<DeliveryResponse> reject(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(deliveryService.reject(principal.getUsername(), id, reason));
    }

    @PutMapping("/{id}/preparing")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Mark delivery as PREPARING (order -> PREPARING)")
    public ResponseEntity<DeliveryResponse> preparing(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.updateStatus(principal.getUsername(), id, DeliveryStatus.PREPARING));
    }

    @PutMapping("/{id}/baked")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Mark delivery as BAKED (order -> BAKED)")
    public ResponseEntity<DeliveryResponse> baked(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.updateStatus(principal.getUsername(), id, DeliveryStatus.BAKED));
    }

    @PutMapping("/{id}/ready-to-pickup")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Mark delivery as READY_TO_PICKUP (order -> READY_TO_PICKUP)")
    public ResponseEntity<DeliveryResponse> readyToPickup(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                deliveryService.updateStatus(principal.getUsername(), id, DeliveryStatus.READY_TO_PICKUP));
    }

    @PutMapping("/{id}/out-for-delivery")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Mark delivery as OUT_FOR_DELIVERY (order -> OUT_FOR_DELIVERY)")
    public ResponseEntity<DeliveryResponse> outForDelivery(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                deliveryService.updateStatus(principal.getUsername(), id, DeliveryStatus.OUT_FOR_DELIVERY));
    }

    @PutMapping("/{id}/delivered")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Mark delivery as DELIVERED (order -> DELIVERED)")
    public ResponseEntity<DeliveryResponse> delivered(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.updateStatus(principal.getUsername(), id, DeliveryStatus.DELIVERED));
    }

    @PutMapping("/{id}/collect-cash")
    @PreAuthorize("hasRole('DELIVERY')")
    @Operation(summary = "Record that cash was collected for a COD order (required before DELIVERED)")
    public ResponseEntity<DeliveryResponse> collectCash(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.collectCash(principal.getUsername(), id));
    }

    @GetMapping("/track/{orderId}")
    @Operation(summary = "Track a delivery by order id (customer/owner, ADMIN, or assigned partner)")
    public ResponseEntity<DeliveryTrackResponse> track(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryService.track(principal.getUsername(), orderId));
    }
}
