package com.smartpizza.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        name = "pizzas",
        indexes = {
                @Index(name = "idx_pizza_name", columnList = "name"),
                @Index(name = "idx_pizza_category", columnList = "category_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pizza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PizzaSize size;

    @Column(nullable = false)
    private boolean veg;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private boolean available;

    /**
     * Many pizzas belong to one category. Lazy-loaded; mapping to DTOs happens
     * inside transactional service methods so the association is initialised safely.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_pizza_category"))
    private Category category;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.rating == null) {
            this.rating = 0.0;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
