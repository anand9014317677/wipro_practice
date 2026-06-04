package com.smartpizza.service;

import com.smartpizza.entity.OrderStatus;

/**
 * Heuristic ETA engine. There are no GPS coordinates in this system, so travel
 * time is a flat, explainable estimate rather than a distance-based prediction.
 * The result is the estimated minutes REMAINING until delivery for a given stage.
 */
public interface EtaService {

    int minutesRemaining(OrderStatus status, int itemCount);
}
