package com.smartpizza.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequest {

    /** Optional. When omitted, the full refundable balance is refunded. */
    @DecimalMin(value = "0.0", inclusive = false, message = "Refund amount must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Refund amount must have at most 8 digits and 2 decimals")
    private BigDecimal amount;

    @Size(max = 255, message = "Reason must be at most 255 characters")
    private String reason;
}
