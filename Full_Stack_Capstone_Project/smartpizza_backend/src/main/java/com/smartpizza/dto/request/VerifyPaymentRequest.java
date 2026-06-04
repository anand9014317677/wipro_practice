package com.smartpizza.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyPaymentRequest {

    @NotNull(message = "Payment id is required")
    @Positive(message = "Payment id must be a positive number")
    private Long paymentId;

    /** Gateway order id returned by the create step. */
    private String gatewayOrderId;

    /** Gateway transaction / payment id. (Mock gateway: send "fail" to simulate failure.) */
    private String transactionId;

    /** Gateway signature, used by real gateways to verify integrity. */
    private String signature;
}
