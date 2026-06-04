package com.smartpizza.service.impl;

import com.smartpizza.dto.response.CouponValidationResponse;
import com.smartpizza.service.CouponService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CouponServiceImpl implements CouponService {

    @Value("${app.order.tax-rate:0.05}")
    private BigDecimal taxRate;

    @Value("${app.order.delivery-fee:40.00}")
    private BigDecimal deliveryFee;

    @Value("${app.order.free-delivery-threshold:500.00}")
    private BigDecimal freeDeliveryThreshold;

    private static final BigDecimal PARTY20_MIN = new BigDecimal("999.00");

    private BigDecimal money(BigDecimal v) {
        return (v == null ? BigDecimal.ZERO : v).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public CouponValidationResponse validate(String couponCode, BigDecimal subtotalIn) {
        BigDecimal subtotal = money(subtotalIn);
        BigDecimal gst = money(subtotal.multiply(taxRate));
        BigDecimal fee = subtotal.compareTo(freeDeliveryThreshold) >= 0 ? money(BigDecimal.ZERO) : money(deliveryFee);

        String code = couponCode == null ? "" : couponCode.trim().toUpperCase();
        BigDecimal discount = money(BigDecimal.ZERO);
        boolean valid = false;
        String message;

        if (code.isEmpty()) {
            message = "No coupon applied";
        } else {
            switch (code) {
                case "PIZZA10" -> {
                    discount = money(subtotal.multiply(new BigDecimal("0.10")));
                    valid = true;
                    message = "PIZZA10 applied — 10% off";
                }
                case "FREEDEL" -> {
                    discount = fee; // cancels the delivery fee
                    valid = true;
                    message = fee.signum() > 0 ? "FREEDEL applied — free delivery" : "Delivery is already free on this order";
                }
                case "PARTY20" -> {
                    if (subtotal.compareTo(PARTY20_MIN) < 0) {
                        message = "PARTY20 is valid only on orders above Rs. 999";
                    } else {
                        discount = money(subtotal.multiply(new BigDecimal("0.20")));
                        valid = true;
                        message = "PARTY20 applied — 20% off";
                    }
                }
                default -> message = "Invalid coupon code";
            }
        }

        BigDecimal grandTotal = money(subtotal.add(gst).add(fee).subtract(discount));
        if (grandTotal.signum() < 0) grandTotal = money(BigDecimal.ZERO);

        return CouponValidationResponse.builder()
                .valid(valid)
                .couponCode(valid ? code : null)
                .subtotal(subtotal)
                .gstAmount(gst)
                .deliveryFee(fee)
                .discountAmount(valid ? discount : money(BigDecimal.ZERO))
                .grandTotal(grandTotal)
                .message(message)
                .build();
    }
}
