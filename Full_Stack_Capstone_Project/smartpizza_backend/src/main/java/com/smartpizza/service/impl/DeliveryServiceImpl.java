package com.smartpizza.service.impl;

import com.smartpizza.dto.request.AssignDeliveryRequest;
import com.smartpizza.dto.response.DeliveryResponse;
import com.smartpizza.dto.response.DeliveryTrackResponse;
import com.smartpizza.entity.*;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.DeliveryMapper;
import com.smartpizza.repository.DeliveryAssignmentRepository;
import com.smartpizza.repository.OrderRepository;
import com.smartpizza.repository.PaymentRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.DeliveryService;
import com.smartpizza.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryAssignmentRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryMapper deliveryMapper;
    private final EmailService emailService;
    private final PaymentRepository paymentRepository;

    /** Statuses a delivery may be in before it can transition to a given target. */
    private static final Map<DeliveryStatus, java.util.Set<DeliveryStatus>> ALLOWED_PREVIOUS = Map.of(
            // Current partner flow: ACCEPTED -> READY_TO_PICKUP -> OUT_FOR_DELIVERY -> DELIVERED.
            DeliveryStatus.READY_TO_PICKUP, java.util.EnumSet.of(DeliveryStatus.ACCEPTED),
            DeliveryStatus.OUT_FOR_DELIVERY,
            java.util.EnumSet.of(DeliveryStatus.READY_TO_PICKUP, DeliveryStatus.ACCEPTED,
                    DeliveryStatus.PREPARING, DeliveryStatus.BAKED),
            DeliveryStatus.DELIVERED, java.util.EnumSet.of(DeliveryStatus.OUT_FOR_DELIVERY),
            // PREPARING/BAKED retained for backward compatibility.
            DeliveryStatus.PREPARING, java.util.EnumSet.of(DeliveryStatus.ACCEPTED),
            DeliveryStatus.BAKED, java.util.EnumSet.of(DeliveryStatus.PREPARING)
    );

    private static final int DEFAULT_ETA_MINUTES = 45;

    /** Build a DeliveryResponse enriched with the order's payment method/status. */
    private DeliveryResponse toEnrichedResponse(DeliveryAssignment da) {
        DeliveryResponse resp = deliveryMapper.toResponse(da);
        if (da.getOrder() != null) {
            paymentRepository.findFirstByOrderIdOrderByCreatedAtDesc(da.getOrder().getId())
                    .ifPresent(payment -> {
                        resp.setPaymentMethod(payment.getMethod().name());
                        resp.setPaymentStatus(payment.getStatus().name());
                    });
        }
        return resp;
    }

    private boolean isCodOrder(DeliveryAssignment da) {
        return da.getOrder() != null && paymentRepository
                .findFirstByOrderIdOrderByCreatedAtDesc(da.getOrder().getId())
                .map(payment -> payment.getMethod() == PaymentMethod.COD)
                .orElse(false);
    }

    @Override
    @Transactional
    public DeliveryResponse assign(String adminEmail, AssignDeliveryRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        // New admin-driven flow assigns after BAKED. CONFIRMED/ACCEPTED/PREPARING are
        // also accepted so the previous flow keeps working.
        java.util.Set<OrderStatus> assignable = java.util.EnumSet.of(
                OrderStatus.CONFIRMED, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.BAKED);
        if (!assignable.contains(order.getStatus())) {
            throw new BadRequestException(
                    "Delivery can only be assigned once an order is confirmed and through the kitchen "
                            + "(allowed: " + assignable + "; current: " + order.getStatus() + ")");
        }

        List<DeliveryAssignment> existing = deliveryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        if (!existing.isEmpty() && existing.get(0).getStatus() != DeliveryStatus.REJECTED) {
            throw new BadRequestException("This order already has an active delivery assignment");
        }

        User partner = userRepository.findById(request.getDeliveryPartnerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getDeliveryPartnerId()));
        if (partner.getRole() != Role.DELIVERY) {
            throw new BadRequestException("The selected user is not a delivery partner");
        }

        int minutes = request.getEstimatedMinutes() != null ? request.getEstimatedMinutes() : DEFAULT_ETA_MINUTES;
        Instant now = Instant.now();

        DeliveryAssignment da = DeliveryAssignment.builder()
                .order(order)
                .deliveryPartner(partner)
                .status(DeliveryStatus.ASSIGNED)
                .assignedAt(now)
                .estimatedDeliveryTime(now.plus(Duration.ofMinutes(minutes)))
                .build();
        da.getStatusHistory().add(history(da, DeliveryStatus.ASSIGNED,
                "Assigned to " + partner.getFullName()));

        DeliveryAssignment savedAssignment = deliveryRepository.save(da);

        // Move the order into ASSIGNED and record it on the order timeline.
        order.setStatus(OrderStatus.ASSIGNED);
        order.getStatusHistory().add(OrderStatusHistory.builder()
                .order(order)
                .status(OrderStatus.ASSIGNED)
                .note("Delivery assigned to " + partner.getFullName())
                .build());
        orderRepository.save(order);

        return toEnrichedResponse(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveryOrders(String userEmail) {
        User user = findUser(userEmail);
        List<DeliveryAssignment> list = (user.getRole() == Role.ADMIN)
                ? deliveryRepository.findAllByOrderByCreatedAtDesc()
                : deliveryRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(user.getId());
        return list.stream().map(this::toEnrichedResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryResponse getById(String userEmail, Long assignmentId) {
        User user = findUser(userEmail);
        DeliveryAssignment da = findAssignment(assignmentId);
        if (user.getRole() != Role.ADMIN && !da.getDeliveryPartner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only view your own assigned deliveries");
        }
        return toEnrichedResponse(da);
    }

    @Override
    @Transactional
    public DeliveryResponse accept(String userEmail, Long assignmentId) {
        User user = findUser(userEmail);
        DeliveryAssignment da = findAssignment(assignmentId);
        requireAssignedPartner(user, da);
        if (da.getStatus() != DeliveryStatus.ASSIGNED) {
            throw new BadRequestException("Only an ASSIGNED delivery can be accepted");
        }
        da.setStatus(DeliveryStatus.ACCEPTED);
        da.setAcceptedAt(Instant.now());
        da.getStatusHistory().add(history(da, DeliveryStatus.ACCEPTED, "Accepted by delivery partner"));
        return toEnrichedResponse(deliveryRepository.save(da));
    }

    @Override
    @Transactional
    public DeliveryResponse reject(String userEmail, Long assignmentId, String reason) {
        User user = findUser(userEmail);
        DeliveryAssignment da = findAssignment(assignmentId);
        requireAssignedPartner(user, da);
        if (da.getStatus() != DeliveryStatus.ASSIGNED) {
            throw new BadRequestException("Only an ASSIGNED delivery can be rejected");
        }
        da.setStatus(DeliveryStatus.REJECTED);
        String note = (reason != null && !reason.isBlank())
                ? "Rejected: " + reason
                : "Rejected by delivery partner";
        da.getStatusHistory().add(history(da, DeliveryStatus.REJECTED, note));
        return toEnrichedResponse(deliveryRepository.save(da));
    }

    @Override
    @Transactional
    public DeliveryResponse updateStatus(String userEmail, Long assignmentId, DeliveryStatus target) {
        User user = findUser(userEmail);
        DeliveryAssignment da = findAssignment(assignmentId);
        requireAssignedPartner(user, da);

        java.util.Set<DeliveryStatus> allowed = ALLOWED_PREVIOUS.get(target);
        if (allowed == null) {
            throw new BadRequestException("Unsupported delivery status transition: " + target);
        }
        if (!allowed.contains(da.getStatus())) {
            throw new BadRequestException(
                    "Delivery must be one of " + allowed + " before it can be marked " + target
                            + " (current: " + da.getStatus() + ")");
        }

        if (target == DeliveryStatus.DELIVERED && isCodOrder(da) && !da.isCashCollected()) {
            throw new BadRequestException(
                    "Collect cash before marking a COD order as delivered");
        }

        da.setStatus(target);
        if (target == DeliveryStatus.DELIVERED) {
            Instant now = Instant.now();
            da.setDeliveredAt(now);
            da.setActualDeliveryTime(now);
        }
        da.getStatusHistory().add(history(da, target, "Status updated to " + target));

        // Keep the order's own status / timeline in sync.
        Order order = da.getOrder();
        OrderStatus orderStatus = OrderStatus.valueOf(target.name());
        order.setStatus(orderStatus);
        order.getStatusHistory().add(OrderStatusHistory.builder()
                .order(order)
                .status(orderStatus)
                .note("Delivery update: " + target)
                .build());
        orderRepository.save(order);

        if (target == DeliveryStatus.DELIVERED) {
            // Initialize lazy associations while the session is open, so the async
            // email (which runs after commit, on another thread) can read them.
            order.getItems().size();
            if (order.getUser() != null) {
                order.getUser().getFullName();
            }
            emailService.sendOrderDelivered(order); // async, best-effort
        }

        return toEnrichedResponse(deliveryRepository.save(da));
    }

    @Override
    @Transactional
    public DeliveryResponse collectCash(String userEmail, Long assignmentId) {
        User user = findUser(userEmail);
        DeliveryAssignment da = findAssignment(assignmentId);
        requireAssignedPartner(user, da);
        if (!isCodOrder(da)) {
            throw new BadRequestException("Cash collection only applies to COD orders");
        }
        if (da.getStatus() == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Order is already delivered");
        }
        if (da.isCashCollected()) {
            throw new BadRequestException("Cash has already been collected for this order");
        }
        da.setCashCollected(true);
        da.getStatusHistory().add(history(da, da.getStatus(), "Cash collected (COD)"));
        return toEnrichedResponse(deliveryRepository.save(da));
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryTrackResponse track(String userEmail, Long orderId) {
        User user = findUser(userEmail);
        List<DeliveryAssignment> list = deliveryRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        if (list.isEmpty()) {
            throw new ResourceNotFoundException("Delivery", "orderId", orderId);
        }
        DeliveryAssignment da = list.get(0);

        boolean allowed = user.getRole() == Role.ADMIN
                || da.getDeliveryPartner().getId().equals(user.getId())
                || da.getOrder().getUser().getId().equals(user.getId());
        if (!allowed) {
            throw new AccessDeniedException("You can only track your own deliveries");
        }
        return deliveryMapper.toTrackResponse(da);
    }

    // ----- helpers -----

    private DeliveryStatusHistory history(DeliveryAssignment da, DeliveryStatus status, String note) {
        return DeliveryStatusHistory.builder()
                .assignment(da)
                .status(status)
                .note(note)
                .build();
    }

    private void requireAssignedPartner(User user, DeliveryAssignment da) {
        if (user.getRole() != Role.DELIVERY || !da.getDeliveryPartner().getId().equals(user.getId())) {
            throw new AccessDeniedException("Only the assigned delivery partner can update this delivery");
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private DeliveryAssignment findAssignment(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DeliveryAssignment", "id", id));
    }
}
