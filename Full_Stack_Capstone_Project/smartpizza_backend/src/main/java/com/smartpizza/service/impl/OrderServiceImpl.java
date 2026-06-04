package com.smartpizza.service.impl;

import com.smartpizza.dto.request.AddToCartRequest;
import com.smartpizza.dto.request.PlaceOrderRequest;
import com.smartpizza.dto.response.CartResponse;
import com.smartpizza.dto.response.OrderResponse;
import com.smartpizza.dto.response.OrderTrackResponse;
import com.smartpizza.entity.*;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.OrderMapper;
import com.smartpizza.repository.CartRepository;
import com.smartpizza.repository.OrderRepository;
import com.smartpizza.repository.PaymentRepository;
import com.smartpizza.repository.PizzaRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.dto.response.CouponValidationResponse;
import com.smartpizza.service.CartService;
import com.smartpizza.service.CouponService;
import com.smartpizza.service.EmailService;
import com.smartpizza.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PizzaRepository pizzaRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final EmailService emailService;
    private final CouponService couponService;

    @Value("${app.order.tax-rate:0.05}")
    private BigDecimal taxRate;

    @Value("${app.order.delivery-fee:40.00}")
    private BigDecimal deliveryFee;

    @Value("${app.order.free-delivery-threshold:500.00}")
    private BigDecimal freeDeliveryThreshold;

    @Override
    @Transactional
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest request) {
        User user = findUser(userEmail);

        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        // Stock / availability check before placing the order
        for (CartItem ci : cart.getItems()) {
            if (!ci.getPizza().isAvailable()) {
                throw new BadRequestException("'" + ci.getPizza().getName()
                        + "' is no longer available. Please remove it from your cart.");
            }
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PLACED)
                .deliveryAddress(request != null ? request.getDeliveryAddress() : null)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            Pizza pizza = ci.getPizza();
            BigDecimal unitPrice = pizza.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            order.getItems().add(OrderItem.builder()
                    .order(order)
                    .pizza(pizza)
                    .pizzaName(pizza.getName())
                    .size(pizza.getSize() != null ? pizza.getSize().name() : null)
                    .veg(pizza.isVeg())
                    .unitPrice(unitPrice)
                    .quantity(ci.getQuantity())
                    .lineTotal(lineTotal)
                    .build());
        }

        subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        BigDecimal tax = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal fee = subtotal.compareTo(freeDeliveryThreshold) >= 0
                ? BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)
                : deliveryFee.setScale(2, RoundingMode.HALF_UP);
        // Optional coupon — discount is validated server-side (never trust the client total).
        BigDecimal discount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        String coupon = (request != null && request.getCouponCode() != null && !request.getCouponCode().isBlank())
                ? request.getCouponCode().trim().toUpperCase()
                : null;
        if (coupon != null) {
            CouponValidationResponse res = couponService.validate(coupon, subtotal);
            if (!res.isValid()) {
                throw new BadRequestException(res.getMessage() != null ? res.getMessage() : "Invalid coupon");
            }
            discount = res.getDiscountAmount();
        }

        BigDecimal total = subtotal.add(tax).add(fee).subtract(discount).setScale(2, RoundingMode.HALF_UP);
        if (total.signum() < 0) {
            total = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setDeliveryFee(fee);
        order.setDiscountAmount(discount);
        order.setCouponCode(coupon);
        order.setTotalAmount(total);
        order.getStatusHistory().add(history(order, OrderStatus.PLACED, "Order placed"));

        Order saved = orderRepository.save(order);

        // Clear the cart after a successful order
        cart.getItems().clear();
        cartRepository.save(cart);

        emailService.sendOrderPlaced(saved); // async, best-effort
        return orderMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = findUser(userEmail);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = findUser(userEmail);
        Order order = findOrder(orderId);
        requireViewAccess(user, order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String userEmail, Long orderId) {
        User user = findUser(userEmail);
        Order order = findOrder(orderId);
        requireOwnerOrAdmin(user, order);

        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException(
                    "Order cannot be cancelled once it is " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.getStatusHistory().add(history(order, OrderStatus.CANCELLED,
                "Order cancelled by " + user.getRole()));

        // Auto-refund a successful non-COD payment. (COD collects nothing up front,
        // so there is nothing to refund.) Done server-side because the refund endpoint
        // is ADMIN-only and a client must never be trusted to trigger its own refund.
        paymentRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId()).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.SUCCESS && payment.getMethod() != PaymentMethod.COD) {
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setRefundedAmount(payment.getTotalAmount());
                payment.setRefundedAt(Instant.now());
                payment.setGatewayResponse("Auto-refund on customer cancellation");
                paymentRepository.save(payment);
                order.getStatusHistory().add(history(order, OrderStatus.CANCELLED,
                        "Refund initiated to original payment method (" + payment.getMethod() + ")"));
            }
        });

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public CartResponse reorder(String userEmail, Long orderId) {
        User user = findUser(userEmail);
        Order order = findOrder(orderId);
        requireOwnerOrAdmin(user, order);

        for (OrderItem item : order.getItems()) {
            if (item.getPizza() == null) {
                continue;
            }
            pizzaRepository.findById(item.getPizza().getId())
                    .filter(Pizza::isAvailable)
                    .ifPresent(pizza -> cartService.addToCart(userEmail,
                            AddToCartRequest.builder()
                                    .pizzaId(pizza.getId())
                                    .quantity(item.getQuantity())
                                    .build()));
        }
        return cartService.getCart(userEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderTrackResponse trackOrder(String userEmail, Long orderId) {
        User user = findUser(userEmail);
        Order order = findOrder(orderId);
        requireViewAccess(user, order);
        return orderMapper.toTrackResponse(order);
    }

    // ----- admin-only kitchen workflow -----

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> listAllOrders(String status) {
        List<Order> orders;
        if (status == null || status.isBlank()) {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        } else {
            OrderStatus parsed;
            try {
                parsed = OrderStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Unknown order status: " + status);
            }
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(parsed);
        }
        return orders.stream().map(orderMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public OrderResponse adminAccept(Long orderId) {
        // accept from PLACED or CONFIRMED (whether or not payment has completed)
        return advance(orderId, OrderStatus.ACCEPTED,
                List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED), "Order accepted by kitchen");
    }

    @Override
    @Transactional
    public OrderResponse adminMarkPreparing(Long orderId) {
        return advance(orderId, OrderStatus.PREPARING,
                List.of(OrderStatus.ACCEPTED), "Kitchen started preparing");
    }

    @Override
    @Transactional
    public OrderResponse adminMarkBaked(Long orderId) {
        return advance(orderId, OrderStatus.BAKED,
                List.of(OrderStatus.PREPARING), "Pizza baked — ready to assign");
    }

    /** Validated admin status transition that records a timeline entry. */
    private OrderResponse advance(Long orderId, OrderStatus target, List<OrderStatus> allowedFrom, String note) {
        Order order = findOrder(orderId);
        if (order.getStatus() == target) {
            throw new BadRequestException("Order is already " + target);
        }
        if (!allowedFrom.contains(order.getStatus())) {
            throw new BadRequestException(
                    "Cannot move order from " + order.getStatus() + " to " + target
                            + " (expected one of " + allowedFrom + ")");
        }
        order.setStatus(target);
        order.getStatusHistory().add(history(order, target, note));
        return orderMapper.toResponse(orderRepository.save(order));
    }

    // ----- helpers -----

    private OrderStatusHistory history(Order order, OrderStatus status, String note) {
        return OrderStatusHistory.builder()
                .order(order)
                .status(status)
                .note(note)
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    /** ADMIN sees all; the owner sees their own. */
    private void requireViewAccess(User user, Order order) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only access your own orders");
        }
    }

    /** Only the owner or an ADMIN may modify (cancel / reorder). */
    private void requireOwnerOrAdmin(User user, Order order) {
        if (user.getRole() != Role.ADMIN && !order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only modify your own orders");
        }
    }
}
