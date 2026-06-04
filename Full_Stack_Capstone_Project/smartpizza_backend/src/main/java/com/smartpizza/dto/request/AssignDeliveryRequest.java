package com.smartpizza.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignDeliveryRequest {

    @NotNull(message = "Order id is required")
    @Positive(message = "Order id must be a positive number")
    private Long orderId;

    @NotNull(message = "Delivery partner id is required")
    @Positive(message = "Delivery partner id must be a positive number")
    private Long deliveryPartnerId;

    /** Optional estimated time to deliver, in minutes. Defaults to 45. */
    @Min(value = 1, message = "Estimated minutes must be at least 1")
    @Max(value = 240, message = "Estimated minutes cannot exceed 240")
    private Integer estimatedMinutes;
}
