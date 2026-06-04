package com.smartpizza.service;

import com.smartpizza.dto.response.CouponValidationResponse;

import java.math.BigDecimal;

public interface CouponService {

    /** Validate a coupon for a given subtotal and return a full billing breakdown. */
    CouponValidationResponse validate(String couponCode, BigDecimal subtotal);
}
