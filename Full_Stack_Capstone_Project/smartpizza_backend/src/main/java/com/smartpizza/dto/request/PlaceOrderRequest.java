package com.smartpizza.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderRequest {

    /** Optional. Where the order should be delivered. */
    @Size(max = 255, message = "Delivery address must be at most 255 characters")
    private String deliveryAddress;

    /** Optional coupon code (e.g. PIZZA10, FREEDEL, PARTY20). */
    @Size(max = 30, message = "Coupon code must be at most 30 characters")
    private String couponCode;
}
