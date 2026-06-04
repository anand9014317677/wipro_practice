package com.smartpizza.mapper;

import com.smartpizza.dto.response.OrderItemResponse;
import com.smartpizza.dto.response.OrderResponse;
import com.smartpizza.dto.response.OrderStatusHistoryResponse;
import com.smartpizza.dto.response.OrderTrackResponse;
import com.smartpizza.entity.Order;
import com.smartpizza.entity.OrderItem;
import com.smartpizza.entity.OrderStatusHistory;
import com.smartpizza.service.EtaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final EtaService etaService;

    public OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .pizzaId(item.getPizza() != null ? item.getPizza().getId() : null)
                .pizzaName(item.getPizzaName())
                .size(item.getSize())
                .veg(item.isVeg())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .lineTotal(item.getLineTotal())
                .build();
    }

    public OrderStatusHistoryResponse toHistoryResponse(OrderStatusHistory h) {
        return OrderStatusHistoryResponse.builder()
                .status(h.getStatus().name())
                .note(h.getNote())
                .changedAt(h.getChangedAt())
                .build();
    }

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::toItemResponse)
                .toList();
        int remaining = etaService.minutesRemaining(order.getStatus(), items.size());
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .items(items)
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .gstAmount(order.getTax())
                .discountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : java.math.BigDecimal.ZERO)
                .grandTotal(order.getTotalAmount())
                .couponCode(order.getCouponCode())
                .deliveryAddress(order.getDeliveryAddress())
                .customerId(order.getUser().getId())
                .customerName(order.getUser().getFullName())
                .customerEmail(order.getUser().getEmail())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .estimatedMinutesRemaining(remaining)
                .estimatedDeliveryTime(remaining > 0 ? Instant.now().plusSeconds(remaining * 60L) : null)
                .build();
    }

    public OrderTrackResponse toTrackResponse(Order order) {
        List<OrderStatusHistoryResponse> timeline = order.getStatusHistory().stream()
                .map(this::toHistoryResponse)
                .toList();
        return OrderTrackResponse.builder()
                .orderId(order.getId())
                .currentStatus(order.getStatus().name())
                .deliveryAddress(order.getDeliveryAddress())
                .placedAt(order.getCreatedAt())
                .timeline(timeline)
                .build();
    }
}
