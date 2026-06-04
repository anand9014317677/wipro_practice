package com.smartpizza.repository;

import com.smartpizza.entity.Pizza;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface PizzaRepository extends JpaRepository<Pizza, Long> {

    boolean existsByCategoryId(Long categoryId);

    /**
     * Dynamic search/filter. Any parameter left null is ignored, which lets a single
     * query power "search by name", "filter by category", "veg only", and "price range"
     * in any combination. Pagination and sorting come from the Pageable argument.
     */
    @Query("""
            SELECT p FROM Pizza p
            WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
              AND (:veg IS NULL OR p.veg = :veg)
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<Pizza> search(@Param("name") String name,
                       @Param("categoryId") Long categoryId,
                       @Param("veg") Boolean veg,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice,
                       Pageable pageable);
}
