package com.smartpizza.repository;

import com.smartpizza.entity.Payment;
import com.smartpizza.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Payment> findAllByOrderByCreatedAtDesc();

    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus status);

    Optional<Payment> findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);
}
