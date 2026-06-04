package com.smartpizza.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * A line in an order. Pizza name, size and unit price are SNAPSHOTTED at checkout
 * so the order is unaffected by later catalogue changes. The pizza reference is
 * kept only to support "reorder".
 */
@Entity
@Table(name = "order_items", indexes = @Index(name = "idx_orderitem_order", columnList = "order_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_orderitem_order"))
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pizza_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_orderitem_pizza"))
    private Pizza pizza;

    @Column(nullable = false, length = 150)
    private String pizzaName;

    @Column(length = 20)
    private String size;

    @Column(nullable = false)
    private boolean veg;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;
}
