package com.smartpizza.service;

public interface InvoiceService {

    /**
     * Render a PDF invoice for an order. Access is restricted to the order's
     * owner or an ADMIN; the check is enforced in the implementation.
     *
     * @return the PDF document as a byte array
     */
    byte[] generateInvoicePdf(String userEmail, Long orderId);
}
