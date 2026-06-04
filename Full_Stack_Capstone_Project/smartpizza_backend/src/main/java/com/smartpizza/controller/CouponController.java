package com.smartpizza.controller;

import com.smartpizza.dto.request.CouponValidateRequest;
import com.smartpizza.dto.response.CouponValidationResponse;
import com.smartpizza.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Coupons", description = "Validate coupons and quote order totals")
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    @Operation(summary = "Validate a coupon for a subtotal; returns the billing breakdown")
    public ResponseEntity<CouponValidationResponse> validate(@Valid @RequestBody CouponValidateRequest request) {
        return ResponseEntity.ok(couponService.validate(request.getCouponCode(), request.getSubtotal()));
    }
}
