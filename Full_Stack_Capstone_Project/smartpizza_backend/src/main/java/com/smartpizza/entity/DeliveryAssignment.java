package com.smartpizza.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "delivery_assignments", indexes = {
        @Index(name = "idx_da_order", columnList = "order_id"),
        @Index(name = "idx_da_partner", columnList = "delivery_partner_id"),
        @Index(name = "idx_da_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_da_order"))
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "delivery_partner_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_da_partner"))
    private User deliveryPartner;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("changedAt ASC")
    @Builder.Default
    private List<DeliveryStatusHistory> statusHistory = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DeliveryStatus status;

    private Instant estimatedDeliveryTime;

    private Instant actualDeliveryTime;

    private Instant assignedAt;

    private Instant acceptedAt;

    private Instant deliveredAt;

    /** Whether the delivery partner has collected cash for a COD order. */
    @Builder.Default
    @Column(nullable = false)
    private boolean cashCollected = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
