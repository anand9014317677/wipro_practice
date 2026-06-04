package com.smartpizza.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponValidateRequest {

    /** Optional. When blank/absent the endpoint returns a plain billing quote (discount 0). */
    private String couponCode;

    @NotNull(message = "Subtotal is required")
    private BigDecimal subtotal;
}
