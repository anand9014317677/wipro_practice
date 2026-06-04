package com.smartpizza.entity;

/**
 * Lifecycle of an order. Stored as a string via @Enumerated(STRING).
 * Admin-driven flow:
 *   PLACED -> (CONFIRMED on payment) -> ACCEPTED -> PREPARING -> BAKED
 *          -> ASSIGNED -> READY_TO_PICKUP -> OUT_FOR_DELIVERY -> DELIVERED.
 * CANCELLED is a terminal state reachable only from PLACED or CONFIRMED.
 *
 * CONFIRMED is retained for backward compatibility: payment success still moves
 * an order to CONFIRMED, and the admin may accept from either PLACED or CONFIRMED.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    ACCEPTED,
    PREPARING,
    BAKED,
    ASSIGNED,
    READY_TO_PICKUP,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
