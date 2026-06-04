package com.smartpizza.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTrackResponse {
    private Long orderId;
    private String currentStatus;
    private String deliveryAddress;
    private Instant placedAt;
    private List<OrderStatusHistoryResponse> timeline;
}
