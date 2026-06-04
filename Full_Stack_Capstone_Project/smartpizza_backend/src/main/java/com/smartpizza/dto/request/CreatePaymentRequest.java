package com.smartpizza.dto.request;

import com.smartpizza.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentRequest {

    @NotNull(message = "Order id is required")
    @Positive(message = "Order id must be a positive number")
    private Long orderId;

    @NotNull(message = "Payment method is required (UPI, CARD, NET_BANKING, COD, WALLET)")
    private PaymentMethod method;
}
