package com.smartpizza.mapper;

import com.smartpizza.dto.response.DeliveryResponse;
import com.smartpizza.dto.response.DeliveryStatusHistoryResponse;
import com.smartpizza.dto.response.DeliveryTrackResponse;
import com.smartpizza.entity.DeliveryAssignment;
import com.smartpizza.entity.DeliveryStatusHistory;
import com.smartpizza.entity.Order;
import com.smartpizza.service.EtaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeliveryMapper {

    private final EtaService etaService;

    public DeliveryStatusHistoryResponse toHistoryResponse(DeliveryStatusHistory h) {
        return DeliveryStatusHistoryResponse.builder()
                .status(h.getStatus().name())
                .note(h.getNote())
                .changedAt(h.getChangedAt())
                .build();
    }

    public DeliveryResponse toResponse(DeliveryAssignment da) {
        Order order = da.getOrder();
        return DeliveryResponse.builder()
                .id(da.getId())
                .orderId(order != null ? order.getId() : null)
                .orderStatus(order != null ? order.getStatus().name() : null)
                .status(da.getStatus().name())
                .deliveryPartnerId(da.getDeliveryPartner() != null ? da.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(da.getDeliveryPartner() != null ? da.getDeliveryPartner().getFullName() : null)
                .customerName(order != null && order.getUser() != null ? order.getUser().getFullName() : null)
                .deliveryAddress(order != null ? order.getDeliveryAddress() : null)
                .totalAmount(order != null ? order.getTotalAmount() : null)
                .cashCollected(da.isCashCollected())
                .estimatedMinutesRemaining(order != null ? etaService.minutesRemaining(order.getStatus(), 0) : null)
                .estimatedDeliveryTime(da.getEstimatedDeliveryTime())
                .actualDeliveryTime(da.getActualDeliveryTime())
                .assignedAt(da.getAssignedAt())
                .acceptedAt(da.getAcceptedAt())
                .deliveredAt(da.getDeliveredAt())
                .createdAt(da.getCreatedAt())
                .updatedAt(da.getUpdatedAt())
                .build();
    }

    public DeliveryTrackResponse toTrackResponse(DeliveryAssignment da) {
        Order order = da.getOrder();
        List<DeliveryStatusHistoryResponse> timeline = da.getStatusHistory().stream()
                .map(this::toHistoryResponse)
                .toList();
        return DeliveryTrackResponse.builder()
                .orderId(order != null ? order.getId() : null)
                .deliveryStatus(da.getStatus().name())
                .deliveryPartnerName(da.getDeliveryPartner() != null ? da.getDeliveryPartner().getFullName() : null)
                .deliveryAddress(order != null ? order.getDeliveryAddress() : null)
                .estimatedDeliveryTime(da.getEstimatedDeliveryTime())
                .actualDeliveryTime(da.getActualDeliveryTime())
                .timeline(timeline)
                .build();
    }
}
