import apiClient from '../api/axiosClient';

export const couponService = {
  /** Validate a coupon (or pass empty code for a plain billing quote). */
  validate: (couponCode, subtotal) =>
    apiClient.post('/coupons/validate', { couponCode: couponCode || '', subtotal }).then((res) => res.data),
};
