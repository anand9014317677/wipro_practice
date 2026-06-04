package com.smartpizza.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryStatusHistoryResponse {
    private String status;
    private String note;
    private Instant changedAt;
}
