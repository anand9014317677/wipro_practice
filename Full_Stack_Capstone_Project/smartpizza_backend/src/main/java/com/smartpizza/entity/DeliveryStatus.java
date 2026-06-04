package com.smartpizza.entity;

/**
 * Lifecycle of a delivery assignment.
 * Current flow: ASSIGNED -> ACCEPTED -> READY_TO_PICKUP -> OUT_FOR_DELIVERY -> DELIVERED.
 * PREPARING/BAKED are retained for backward compatibility with earlier data/flows.
 * REJECTED is terminal and only reachable from ASSIGNED (before acceptance).
 */
public enum DeliveryStatus {
    ASSIGNED,
    ACCEPTED,
    READY_TO_PICKUP,
    PREPARING,
    BAKED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    REJECTED
}
