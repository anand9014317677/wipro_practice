package com.smartpizza.service;

import com.smartpizza.dto.request.PlaceOrderRequest;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.dto.response.OrderResponse;
import com.smartpizza.dto.response.OrderTrackResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(String userEmail, PlaceOrderRequest request);

    List<OrderResponse> getMyOrders(String userEmail);

    OrderResponse getOrderById(String userEmail, Long orderId);

    OrderResponse cancelOrder(String userEmail, Long orderId);

    CartResponse reorder(String userEmail, Long orderId);

    OrderTrackResponse trackOrder(String userEmail, Long orderId);

    // ----- admin-only kitchen workflow -----

    List<OrderResponse> listAllOrders(String status);

    OrderResponse adminAccept(Long orderId);

    OrderResponse adminMarkPreparing(Long orderId);

    OrderResponse adminMarkBaked(Long orderId);
}
