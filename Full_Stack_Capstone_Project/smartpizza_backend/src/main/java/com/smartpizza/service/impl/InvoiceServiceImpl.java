package com.smartpizza.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.smartpizza.entity.Order;
import com.smartpizza.entity.OrderItem;
import com.smartpizza.entity.Payment;
import com.smartpizza.entity.Role;
import com.smartpizza.entity.User;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.repository.OrderRepository;
import com.smartpizza.repository.PaymentRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    // Standard PDF fonts don't include the rupee glyph (U+20B9); use "Rs." so amounts always render.
    private static final Color BRAND = new Color(234, 88, 12);   // orange-600
    private static final Color DARK = new Color(31, 41, 55);     // slate-800
    private static final Color MUTED = new Color(107, 114, 128); // gray-500
    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm").withZone(ZoneId.systemDefault());

    @Override
    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(String userEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(requester.getId());
        if (requester.getRole() != Role.ADMIN && !isOwner) {
            throw new AccessDeniedException("You can only download invoices for your own orders");
        }

        Payment payment = paymentRepository.findFirstByOrderIdOrderByCreatedAtDesc(orderId).orElse(null);

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document doc = new Document(PageSize.A4, 42, 42, 48, 48);
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Header: brand + invoice meta
            PdfPTable header = new PdfPTable(2);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{1.4f, 1f});

            PdfPCell brandWrap = noBorder(null);
            brandWrap.addElement(new Paragraph("SmartPizza",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BRAND)));
            brandWrap.addElement(new Paragraph("Tax Invoice / Receipt",
                    FontFactory.getFont(FontFactory.HELVETICA, 11, MUTED)));

            PdfPCell metaCell = noBorder(null);
            metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(rightLine("Invoice: INV-" + order.getId(), true));
            metaCell.addElement(rightLine("Receipt: " + (payment != null ? "RCPT-" + payment.getId() : "—"), false));
            metaCell.addElement(rightLine("Order #" + order.getId(), false));
            metaCell.addElement(rightLine(DATE_FMT.format(order.getCreatedAt()), false));

            header.addCell(brandWrap);
            header.addCell(metaCell);
            doc.add(header);

            doc.add(spacer(14));

            // Customer + status block
            User customer = order.getUser();
            PdfPTable info = new PdfPTable(2);
            info.setWidthPercentage(100);
            info.setWidths(new float[]{1f, 1f});
            info.addCell(noBorder(label("Billed to")));
            info.addCell(noBorder(label("Details")));
            info.addCell(noBorder(value(customer != null ? safe(customer.getFullName()) : "Customer")));
            info.addCell(noBorder(value("Order status: " + order.getStatus())));
            info.addCell(noBorder(value(customer != null ? safe(customer.getEmail()) : "")));
            info.addCell(noBorder(value("Payment: "
                    + (payment != null ? payment.getMethod() + " · " + payment.getStatus() : "Pending"))));
            if (order.getDeliveryAddress() != null) {
                info.addCell(noBorder(value(order.getDeliveryAddress())));
                info.addCell(noBorder(value(payment != null && payment.getTransactionId() != null
                        ? "Txn: " + payment.getTransactionId() : " ")));
            }
            doc.add(info);

            doc.add(spacer(14));

            // Items table
            PdfPTable items = new PdfPTable(new float[]{4.2f, 1f, 1.6f, 1.6f});
            items.setWidthPercentage(100);
            headerCell(items, "Item");
            headerCell(items, "Qty");
            headerCell(items, "Unit price");
            headerCell(items, "Amount");
            for (OrderItem it : order.getItems()) {
                String name = safe(it.getPizzaName()) + (it.getSize() != null ? " (" + it.getSize() + ")" : "");
                bodyCell(items, name, Element.ALIGN_LEFT);
                bodyCell(items, String.valueOf(it.getQuantity()), Element.ALIGN_CENTER);
                bodyCell(items, money(it.getUnitPrice()), Element.ALIGN_RIGHT);
                bodyCell(items, money(it.getLineTotal()), Element.ALIGN_RIGHT);
            }
            doc.add(items);

            doc.add(spacer(10));

            // Totals
            PdfPTable totals = new PdfPTable(new float[]{3f, 1.6f});
            totals.setWidthPercentage(50);
            totals.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalRow(totals, "Subtotal", money(order.getSubtotal()), false);
            totalRow(totals, "GST (5%)", money(order.getTax()), false);
            totalRow(totals, "Delivery fee",
                    order.getDeliveryFee() != null && order.getDeliveryFee().signum() > 0
                            ? money(order.getDeliveryFee()) : "Free", false);
            BigDecimal discount = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;
            if (discount.signum() > 0) {
                String label = "Discount" + (order.getCouponCode() != null ? " (" + order.getCouponCode() + ")" : "");
                totalRow(totals, label, "- " + money(discount), false);
            }
            totalRow(totals, "Grand total", money(order.getTotalAmount()), true);
            doc.add(totals);

            doc.add(spacer(24));
            Paragraph footer = new Paragraph(
                    "Thank you for ordering with SmartPizza. This is a computer-generated invoice.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, MUTED));
            footer.setAlignment(Element.ALIGN_CENTER);
            doc.add(footer);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate invoice PDF: " + e.getMessage(), e);
        }
    }

    // ---- small PDF helpers ----

    private String money(BigDecimal v) {
        return "Rs. " + (v == null ? "0.00" : v.setScale(2, RoundingMode.HALF_UP).toPlainString());
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

    private PdfPCell noBorder(Phrase phrase) {
        PdfPCell c = phrase != null ? new PdfPCell(phrase) : new PdfPCell();
        c.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
        c.setPadding(2f);
        return c;
    }

    private Paragraph rightLine(String text, boolean bold) {
        Paragraph p = new Paragraph(text, FontFactory.getFont(
                bold ? FontFactory.HELVETICA_BOLD : FontFactory.HELVETICA, bold ? 12 : 10,
                bold ? DARK : MUTED));
        p.setAlignment(Element.ALIGN_RIGHT);
        return p;
    }

    private Phrase label(String text) {
        return new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, MUTED));
    }

    private Phrase value(String text) {
        return new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 11, DARK));
    }

    private void headerCell(PdfPTable t, String text) {
        PdfPCell c = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE)));
        c.setBackgroundColor(BRAND);
        c.setPadding(6f);
        c.setHorizontalAlignment(Element.ALIGN_LEFT);
        t.addCell(c);
    }

    private void bodyCell(PdfPTable t, String text, int align) {
        PdfPCell c = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 10, DARK)));
        c.setPadding(6f);
        c.setHorizontalAlignment(align);
        c.setBorderColor(new Color(229, 231, 235));
        t.addCell(c);
    }

    private void totalRow(PdfPTable t, String label, String value, boolean grand) {
        Font f = FontFactory.getFont(grand ? FontFactory.HELVETICA_BOLD : FontFactory.HELVETICA,
                grand ? 12 : 10, grand ? DARK : MUTED);
        PdfPCell l = new PdfPCell(new Phrase(label, f));
        PdfPCell v = new PdfPCell(new Phrase(value, FontFactory.getFont(
                grand ? FontFactory.HELVETICA_BOLD : FontFactory.HELVETICA, grand ? 12 : 10, DARK)));
        l.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
        v.setBorder(grand ? com.lowagie.text.Rectangle.TOP : com.lowagie.text.Rectangle.NO_BORDER);
        v.setBorderColor(new Color(229, 231, 235));
        l.setPadding(4f);
        v.setPadding(4f);
        v.setHorizontalAlignment(Element.ALIGN_RIGHT);
        t.addCell(l);
        t.addCell(v);
    }

    private Paragraph spacer(float height) {
        Paragraph p = new Paragraph(" ");
        p.setSpacingAfter(height);
        return p;
    }
}
