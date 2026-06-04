package com.smartpizza.service.impl;

import com.smartpizza.entity.OrderStatus;
import com.smartpizza.service.EtaService;
import org.springframework.stereotype.Service;

@Service
public class EtaServiceImpl implements EtaService {

    /** Flat travel estimate (no geo data available). Honest, explainable in viva. */
    private static final int TRAVEL_MINUTES = 15;

    private int basePrep(int itemCount) {
        if (itemCount >= 6) return 25;
        if (itemCount >= 3) return 18;
        return 10;
    }

    @Override
    public int minutesRemaining(OrderStatus status, int itemCount) {
        if (status == null) return 0;
        int prep = basePrep(itemCount);
        return switch (status) {
            case PLACED, CONFIRMED -> prep + TRAVEL_MINUTES;              // full prep + travel
            case ACCEPTED -> Math.round(prep * 0.7f) + TRAVEL_MINUTES;   // prep mostly ahead
            case PREPARING -> Math.round(prep * 0.4f) + TRAVEL_MINUTES;  // prep underway
            case BAKED, ASSIGNED -> TRAVEL_MINUTES + 3;                  // prep done, mostly travel
            case READY_TO_PICKUP -> 12;
            case OUT_FOR_DELIVERY -> 8;
            case DELIVERED, CANCELLED -> 0;
        };
    }
}
