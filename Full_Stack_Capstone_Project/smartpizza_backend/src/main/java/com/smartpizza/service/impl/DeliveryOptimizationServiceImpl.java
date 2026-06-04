package com.smartpizza.service.impl;

import com.smartpizza.dto.response.PartnerRecommendationResponse;
import com.smartpizza.dto.response.PartnerRecommendationResponse.PartnerWorkload;
import com.smartpizza.entity.DeliveryAssignment;
import com.smartpizza.entity.DeliveryStatus;
import com.smartpizza.entity.Role;
import com.smartpizza.entity.User;
import com.smartpizza.repository.DeliveryAssignmentRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.DeliveryOptimizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryOptimizationServiceImpl implements DeliveryOptimizationService {

    private final UserRepository userRepository;
    private final DeliveryAssignmentRepository deliveryRepository;

    /** Flat travel estimate — no GPS data available. */
    private static final int ESTIMATED_TRAVEL_MINUTES = 15;

    private boolean isActive(DeliveryStatus s) {
        return s != DeliveryStatus.DELIVERED && s != DeliveryStatus.REJECTED;
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerRecommendationResponse recommend() {
        List<User> partners = userRepository.findByRole(Role.DELIVERY);

        List<PartnerWorkload> candidates = new ArrayList<>();
        for (User p : partners) {
            long active = deliveryRepository
                    .findByDeliveryPartnerIdOrderByCreatedAtDesc(p.getId())
                    .stream()
                    .map(DeliveryAssignment::getStatus)
                    .filter(this::isActive)
                    .count();
            candidates.add(PartnerWorkload.builder()
                    .partnerId(p.getId())
                    .name(p.getFullName())
                    .email(p.getEmail())
                    .activeDeliveries((int) active)
                    .recommended(false)
                    .build());
        }

        // Fewest active deliveries wins; tie-break by id (stable, oldest partner first).
        candidates.sort(Comparator
                .comparingInt(PartnerWorkload::getActiveDeliveries)
                .thenComparing(PartnerWorkload::getPartnerId));

        PartnerRecommendationResponse.PartnerRecommendationResponseBuilder builder =
                PartnerRecommendationResponse.builder()
                        .estimatedTravelMinutes(ESTIMATED_TRAVEL_MINUTES)
                        .candidates(candidates);

        if (!candidates.isEmpty()) {
            PartnerWorkload best = candidates.get(0);
            best.setRecommended(true);
            builder.recommendedPartnerId(best.getPartnerId())
                    .recommendedPartnerName(best.getName())
                    .recommendedActiveDeliveries(best.getActiveDeliveries());
        }
        return builder.build();
    }
}
