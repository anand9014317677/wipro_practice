package com.smartpizza.controller;

import com.smartpizza.dto.request.CreatePaymentRequest;
import com.smartpizza.dto.request.RefundRequest;
import com.smartpizza.dto.request.VerifyPaymentRequest;
import com.smartpizza.dto.response.PaymentResponse;
import com.smartpizza.service.InvoiceService;
import com.smartpizza.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments", description = "Create, verify, view and refund payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;

    @PostMapping("/create")
    @Operation(summary = "Create a payment for an order (order must be PLACED)")
    public ResponseEntity<PaymentResponse> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPayment(principal.getUsername(), request));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify a pending payment; success confirms the order")
    public ResponseEntity<PaymentResponse> verify(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(principal.getUsername(), request));
    }

    @GetMapping("/history")
    @Operation(summary = "Payment history (own payments; ADMIN sees all)")
    public ResponseEntity<List<PaymentResponse>> history(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(paymentService.getHistory(principal.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single payment / receipt by id (owner or ADMIN)")
    public ResponseEntity<PaymentResponse> getById(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(principal.getUsername(), id));
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund a successful payment, fully or partially (ADMIN only)")
    public ResponseEntity<PaymentResponse> refund(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody(required = false) RefundRequest request) {
        return ResponseEntity.ok(paymentService.refund(principal.getUsername(), id, request));
    }

    @GetMapping("/invoice/{orderId}")
    @Operation(summary = "Download a PDF invoice for an order (owner or ADMIN)")
    public ResponseEntity<byte[]> invoice(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long orderId) {
        byte[] pdf = invoiceService.generateInvoicePdf(principal.getUsername(), orderId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice-" + orderId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
