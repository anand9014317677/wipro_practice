package com.smartpizza.repository;

import com.smartpizza.entity.DeliveryAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {

    List<DeliveryAssignment> findByDeliveryPartnerIdOrderByCreatedAtDesc(Long deliveryPartnerId);

    List<DeliveryAssignment> findAllByOrderByCreatedAtDesc();

    List<DeliveryAssignment> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
