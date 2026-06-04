package com.smartpizza.service;

import com.smartpizza.dto.request.AssignDeliveryRequest;
import com.smartpizza.dto.response.DeliveryResponse;
import com.smartpizza.dto.response.DeliveryTrackResponse;
import com.smartpizza.entity.DeliveryStatus;

import java.util.List;

public interface DeliveryService {

    DeliveryResponse assign(String adminEmail, AssignDeliveryRequest request);

    List<DeliveryResponse> getDeliveryOrders(String userEmail);

    DeliveryResponse getById(String userEmail, Long assignmentId);

    DeliveryResponse accept(String userEmail, Long assignmentId);

    DeliveryResponse reject(String userEmail, Long assignmentId, String reason);

    DeliveryResponse updateStatus(String userEmail, Long assignmentId, DeliveryStatus target);

    DeliveryResponse collectCash(String userEmail, Long assignmentId);

    DeliveryTrackResponse track(String userEmail, Long orderId);
}
