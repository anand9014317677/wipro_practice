package com.smartpizza.service.impl;

import com.smartpizza.dto.request.CreatePaymentRequest;
import com.smartpizza.dto.request.RefundRequest;
import com.smartpizza.dto.request.VerifyPaymentRequest;
import com.smartpizza.dto.response.PaymentResponse;
import com.smartpizza.entity.*;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.PaymentMapper;
import com.smartpizza.repository.OrderRepository;
import com.smartpizza.repository.PaymentRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.PaymentGateway;
import com.smartpizza.service.EmailService;
import com.smartpizza.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentGateway paymentGateway;
    private final EmailService emailService;

    @Override
    @Transactional
    public PaymentResponse createPayment(String userEmail, CreatePaymentRequest request) {
        User user = findUser(userEmail);
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        requireOwner(user, order);

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Payment can only be created for an order in the PLACED state");
        }
        if (paymentRepository.existsByOrderIdAndStatus(order.getId(), PaymentStatus.SUCCESS)) {
            throw new BadRequestException("This order has already been paid");
        }

        Payment payment = Payment.builder()
                .order(order)
                .user(user)
                .method(request.getMethod())
                .status(PaymentStatus.PENDING)
                .currency("INR")
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .couponCode(order.getCouponCode())
                .refundedAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .build();

        if (request.getMethod() == PaymentMethod.COD) {
            // Cash on delivery: the order is confirmed now; cash is collected on delivery.
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("COD-" + order.getId());
            payment.setGatewayResponse("Cash on delivery selected");
            payment.setPaidAt(Instant.now());
            confirmOrder(order, "Payment confirmed (Cash on Delivery)");
        } else {
            PaymentGateway.GatewayOrder gatewayOrder =
                    paymentGateway.createOrder(order.getTotalAmount(), "INR", "order_" + order.getId());
            payment.setGatewayOrderId(gatewayOrder.gatewayOrderId());
            payment.setGatewayResponse("Gateway order created via " + gatewayOrder.provider());
            // Stays PENDING until /verify confirms it.
        }

        Payment saved = paymentRepository.save(payment);
        if (saved.getStatus() == PaymentStatus.SUCCESS) {
            emailService.sendPaymentSuccess(saved); // async, best-effort
        }
        return paymentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PaymentResponse verifyPayment(String userEmail, VerifyPaymentRequest request) {
        User user = findUser(userEmail);
        Payment payment = findPayment(request.getPaymentId());
        requireOwner(user, payment.getOrder());

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment is not pending verification");
        }

        boolean verified = paymentGateway.verify(
                request.getGatewayOrderId(), request.getTransactionId(), request.getSignature());

        if (verified) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(request.getTransactionId());
            payment.setGatewayResponse("Verified: gatewayOrderId=" + request.getGatewayOrderId()
                    + ", signature=" + request.getSignature());
            payment.setPaidAt(Instant.now());

            Order order = payment.getOrder();
            if (order.getStatus() == OrderStatus.PLACED) {
                confirmOrder(order, "Payment confirmed");
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setGatewayResponse("Verification failed for gatewayOrderId=" + request.getGatewayOrderId());
            // Order intentionally stays in PLACED so the customer can retry.
        }

        Payment saved = paymentRepository.save(payment);
        if (saved.getStatus() == PaymentStatus.SUCCESS) {
            emailService.sendPaymentSuccess(saved); // async, best-effort
        }
        return paymentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getHistory(String userEmail) {
        User user = findUser(userEmail);
        List<Payment> payments = (user.getRole() == Role.ADMIN)
                ? paymentRepository.findAllByOrderByCreatedAtDesc()
                : paymentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return payments.stream().map(paymentMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getById(String userEmail, Long paymentId) {
        User user = findUser(userEmail);
        Payment payment = findPayment(paymentId);
        if (user.getRole() != Role.ADMIN && !payment.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only view your own payments");
        }
        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse refund(String userEmail, Long paymentId, RefundRequest request) {
        User user = findUser(userEmail);
        if (user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only an administrator can process refunds");
        }

        Payment payment = findPayment(paymentId);

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Only successful payments can be refunded");
        }
        if (payment.getOrder().getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Refunds are not allowed after the order is delivered");
        }

        BigDecimal refundable = payment.getTotalAmount().subtract(payment.getRefundedAmount());
        BigDecimal amount = (request != null && request.getAmount() != null)
                ? request.getAmount().setScale(2, RoundingMode.HALF_UP)
                : refundable;

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Refund amount must be greater than zero");
        }
        if (amount.compareTo(refundable) > 0) {
            throw new BadRequestException("Refund amount exceeds the refundable balance of " + refundable);
        }

        String refundId = paymentGateway.refund(payment.getTransactionId(), amount);

        BigDecimal newRefunded = payment.getRefundedAmount().add(amount).setScale(2, RoundingMode.HALF_UP);
        payment.setRefundedAmount(newRefunded);
        if (newRefunded.compareTo(payment.getTotalAmount()) >= 0) {
            payment.setStatus(PaymentStatus.REFUNDED);
        }
        payment.setRefundedAt(Instant.now());
        String reason = (request != null && request.getReason() != null) ? ", reason=" + request.getReason() : "";
        payment.setGatewayResponse("Refund processed: refundId=" + refundId + ", amount=" + amount + reason);

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    // ----- helpers -----

    private void confirmOrder(Order order, String note) {
        order.setStatus(OrderStatus.CONFIRMED);
        order.getStatusHistory().add(OrderStatusHistory.builder()
                .order(order)
                .status(OrderStatus.CONFIRMED)
                .note(note)
                .build());
        orderRepository.save(order);
    }

    private void requireOwner(User user, Order order) {
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only pay for your own orders");
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Payment findPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
    }
}
