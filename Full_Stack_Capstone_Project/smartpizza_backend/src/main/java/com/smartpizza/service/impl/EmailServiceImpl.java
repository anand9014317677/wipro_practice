package com.smartpizza.service.impl;

import com.smartpizza.entity.Order;
import com.smartpizza.entity.OrderItem;
import com.smartpizza.entity.Payment;
import com.smartpizza.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Async, fail-safe email sender.
 *
 * Safety guarantees:
 *  - Disabled by default (app.mail.enabled=false) — does nothing until configured.
 *  - The JavaMailSender is optional, so the app starts even with no SMTP config.
 *  - Every method is @Async and wraps all work in try/catch, so a mail problem
 *    never propagates into order/payment/delivery transactions.
 */
@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.enabled:false}")
    private boolean enabled;

    @Value("${app.mail.from:SmartPizza <no-reply@smartpizza.ai>}")
    private String from;

    public EmailServiceImpl(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    @Override
    @Async
    public void sendOrderPlaced(Order order) {
        if (notReady(order)) return;
        String html = "<h2>Thanks for your order! 🍕</h2>"
                + "<p>Hi " + safe(order.getUser().getFullName()) + ", we've received your order.</p>"
                + summaryBlock(order)
                + statusLine(order.getStatus().name())
                + footer();
        dispatch(order.getUser().getEmail(), "Your SmartPizza order #" + order.getId() + " is placed", html);
    }

    @Override
    @Async
    public void sendPaymentSuccess(Payment payment) {
        if (!enabled) return;
        JavaMailSender sender = sender();
        if (sender == null || payment == null || payment.getUser() == null) return;
        Order order = payment.getOrder();
        String html = "<h2>Payment successful ✅</h2>"
                + "<p>Hi " + safe(payment.getUser().getFullName()) + ", your payment has been received.</p>"
                + "<table style='border-collapse:collapse'>"
                + row("Receipt", "RCPT-" + payment.getId())
                + row("Transaction", safe(payment.getTransactionId()))
                + row("Method", payment.getMethod() != null ? payment.getMethod().name() : "-")
                + row("Amount", inr(payment.getTotalAmount()))
                + (order != null ? row("Order", "#" + order.getId()) : "")
                + "</table>"
                + footer();
        dispatch(payment.getUser().getEmail(), "Payment received · Receipt RCPT-" + payment.getId(), html);
    }

    @Override
    @Async
    public void sendOrderDelivered(Order order) {
        if (notReady(order)) return;
        String html = "<h2>Delivered — enjoy! 🎉</h2>"
                + "<p>Hi " + safe(order.getUser().getFullName()) + ", your order has been delivered.</p>"
                + summaryBlock(order)
                + "<p>Thank you for ordering with SmartPizza. We hope to see you again soon!</p>"
                + footer();
        dispatch(order.getUser().getEmail(), "Your SmartPizza order #" + order.getId() + " was delivered", html);
    }

    // ----- helpers -----

    private boolean notReady(Order order) {
        return !enabled || sender() == null || order == null || order.getUser() == null;
    }

    private JavaMailSender sender() {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (enabled && sender == null) {
            log.warn("app.mail.enabled=true but no JavaMailSender is configured (set spring.mail.host). Skipping email.");
        }
        return sender;
    }

    private void dispatch(String to, String subject, String html) {
        if (to == null || to.isBlank()) return;
        try {
            JavaMailSender sender = sender();
            if (sender == null) return;
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(wrap(html), true);
            sender.send(message);
            log.info("Sent '{}' email to {}", subject, to);
        } catch (Exception e) {
            // Never propagate — email is best-effort.
            log.error("Failed to send email '{}' to {}: {}", subject, to, e.getMessage());
        }
    }

    private String summaryBlock(Order order) {
        StringBuilder rows = new StringBuilder();
        for (OrderItem it : order.getItems()) {
            rows.append("<tr><td style='padding:4px 12px 4px 0'>")
                .append(safe(it.getPizzaName())).append(" × ").append(it.getQuantity())
                .append("</td><td style='padding:4px 0;text-align:right'>")
                .append(inr(it.getLineTotal())).append("</td></tr>");
        }
        return "<table style='border-collapse:collapse;margin:12px 0'>" + rows + "</table>"
                + "<table style='border-collapse:collapse'>"
                + row("Subtotal", inr(order.getSubtotal()))
                + row("Tax", inr(order.getTax()))
                + row("Delivery", inr(order.getDeliveryFee()))
                + row("<strong>Total</strong>", "<strong>" + inr(order.getTotalAmount()) + "</strong>")
                + "</table>";
    }

    private String statusLine(String status) {
        return "<p>Status: <strong>" + status.replace('_', ' ') + "</strong></p>";
    }

    private String row(String label, String value) {
        return "<tr><td style='padding:2px 16px 2px 0;color:#666'>" + label
                + "</td><td style='padding:2px 0;text-align:right'>" + value + "</td></tr>";
    }

    private String wrap(String body) {
        return "<div style='font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;"
                + "padding:24px;color:#111'>"
                + "<div style='font-size:20px;font-weight:800;color:#ea580c;margin-bottom:8px'>SmartPizza</div>"
                + body + "</div>";
    }

    private String footer() {
        return "<hr style='border:none;border-top:1px solid #eee;margin:20px 0'/>"
                + "<p style='font-size:12px;color:#999'>SmartPizza AI · This is an automated message.</p>";
    }

    private String inr(BigDecimal v) {
        return "₹" + (v == null ? "0.00" : v.setScale(2, RoundingMode.HALF_UP).toPlainString());
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
