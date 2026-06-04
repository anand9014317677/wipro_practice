package com.smartpizza.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryTrackResponse {
    private Long orderId;
    private String deliveryStatus;
    private String deliveryPartnerName;
    private String deliveryAddress;
    private Instant estimatedDeliveryTime;
    private Instant actualDeliveryTime;
    private List<DeliveryStatusHistoryResponse> timeline;
}
