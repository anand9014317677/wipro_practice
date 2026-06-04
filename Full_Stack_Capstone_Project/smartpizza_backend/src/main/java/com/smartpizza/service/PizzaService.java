package com.smartpizza.service;

import com.smartpizza.dto.request.PizzaRequest;
import com.smartpizza.dto.response.PageResponse;
import com.smartpizza.dto.response.PizzaResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface PizzaService {

    PizzaResponse create(PizzaRequest request);

    PageResponse<PizzaResponse> getAll(Pageable pageable);

    PizzaResponse getById(Long id);

    PizzaResponse update(Long id, PizzaRequest request);

    void delete(Long id);

    PageResponse<PizzaResponse> search(String name,
                                       Long categoryId,
                                       Boolean veg,
                                       BigDecimal minPrice,
                                       BigDecimal maxPrice,
                                       Pageable pageable);
}
