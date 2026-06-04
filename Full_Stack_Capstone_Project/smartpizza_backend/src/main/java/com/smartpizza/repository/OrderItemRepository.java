package com.smartpizza.repository;

import com.smartpizza.entity.OrderItem;
import com.smartpizza.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

/**
 * Aggregation queries that feed the recommendation engine. Cancelled orders are
 * always excluded so they don't pollute popularity / affinity signals.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT oi.pizza.id AS pizzaId, SUM(oi.quantity) AS totalQuantity
            FROM OrderItem oi
            WHERE oi.order.status <> :excluded
            GROUP BY oi.pizza.id
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<PizzaCount> findGlobalPizzaCounts(@Param("excluded") OrderStatus excluded);

    @Query("""
            SELECT oi.pizza.category.id AS categoryId, SUM(oi.quantity) AS totalQuantity
            FROM OrderItem oi
            WHERE oi.order.user.id = :userId AND oi.order.status <> :excluded
            GROUP BY oi.pizza.category.id
            """)
    List<CategoryCount> findUserCategoryCounts(@Param("userId") Long userId,
                                               @Param("excluded") OrderStatus excluded);

    @Query("""
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM OrderItem oi
            WHERE oi.order.user.id = :userId AND oi.order.status <> :excluded
            """)
    long sumUserQuantity(@Param("userId") Long userId, @Param("excluded") OrderStatus excluded);

    @Query("""
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM OrderItem oi
            WHERE oi.order.user.id = :userId AND oi.pizza.veg = true AND oi.order.status <> :excluded
            """)
    long sumUserVegQuantity(@Param("userId") Long userId, @Param("excluded") OrderStatus excluded);

    @Query("""
            SELECT DISTINCT oi.pizza.id
            FROM OrderItem oi
            WHERE oi.order.user.id = :userId
              AND oi.order.createdAt >= :since
              AND oi.order.status <> :excluded
            """)
    List<Long> findRecentlyPurchasedPizzaIds(@Param("userId") Long userId,
                                             @Param("since") Instant since,
                                             @Param("excluded") OrderStatus excluded);

    /** Projection: total quantity ordered per pizza. */
    interface PizzaCount {
        Long getPizzaId();
        Long getTotalQuantity();
    }

    /** Projection: total quantity ordered per category (for one user). */
    interface CategoryCount {
        Long getCategoryId();
        Long getTotalQuantity();
    }
}
