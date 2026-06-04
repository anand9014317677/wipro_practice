package com.smartpizza.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryResponse {
    private Long id;
    private Long orderId;
    private String orderStatus;
    private String status;
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private String customerName;
    private String deliveryAddress;
    private BigDecimal totalAmount;
    private String paymentMethod;   // UPI/CARD/NET_BANKING/COD/WALLET (null if none)
    private String paymentStatus;   // PENDING/SUCCESS/FAILED/REFUNDED (null if none)
    private boolean cashCollected;  // true once a COD order's cash has been collected
    private Integer estimatedMinutesRemaining; // heuristic ETA in minutes
    private Instant estimatedDeliveryTime;
    private Instant actualDeliveryTime;
    private Instant assignedAt;
    private Instant acceptedAt;
    private Instant deliveredAt;
    private Instant createdAt;
    private Instant updatedAt;
}
