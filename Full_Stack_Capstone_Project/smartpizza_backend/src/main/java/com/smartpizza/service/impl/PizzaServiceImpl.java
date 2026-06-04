package com.smartpizza.service.impl;

import com.smartpizza.dto.request.PizzaRequest;
import com.smartpizza.dto.response.PageResponse;
import com.smartpizza.dto.response.PizzaResponse;
import com.smartpizza.entity.Category;
import com.smartpizza.entity.Pizza;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.PizzaMapper;
import com.smartpizza.repository.CategoryRepository;
import com.smartpizza.repository.PizzaRepository;
import com.smartpizza.service.PizzaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PizzaServiceImpl implements PizzaService {

    private final PizzaRepository pizzaRepository;
    private final CategoryRepository categoryRepository;
    private final PizzaMapper pizzaMapper;

    @Override
    @Transactional
    public PizzaResponse create(PizzaRequest request) {
        Category category = findCategoryOrThrow(request.getCategoryId());
        Pizza pizza = pizzaMapper.toEntity(request, category);
        return pizzaMapper.toResponse(pizzaRepository.save(pizza));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PizzaResponse> getAll(Pageable pageable) {
        return PageResponse.from(pizzaRepository.findAll(pageable), pizzaMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PizzaResponse getById(Long id) {
        return pizzaMapper.toResponse(findPizzaOrThrow(id));
    }

    @Override
    @Transactional
    public PizzaResponse update(Long id, PizzaRequest request) {
        Pizza pizza = findPizzaOrThrow(id);
        Category category = findCategoryOrThrow(request.getCategoryId());
        pizzaMapper.updateEntity(pizza, request, category);
        return pizzaMapper.toResponse(pizzaRepository.save(pizza));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Pizza pizza = findPizzaOrThrow(id);
        pizzaRepository.delete(pizza);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PizzaResponse> search(String name,
                                              Long categoryId,
                                              Boolean veg,
                                              BigDecimal minPrice,
                                              BigDecimal maxPrice,
                                              Pageable pageable) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new BadRequestException("minPrice cannot be greater than maxPrice");
        }
        String nameFilter = (name == null || name.isBlank()) ? null : name.trim();
        Page<Pizza> result = pizzaRepository.search(nameFilter, categoryId, veg, minPrice, maxPrice, pageable);
        return PageResponse.from(result, pizzaMapper::toResponse);
    }

    private Pizza findPizzaOrThrow(Long id) {
        return pizzaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pizza", "id", id));
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }
}
