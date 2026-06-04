package com.smartpizza.service.impl;

import com.smartpizza.dto.request.CategoryRequest;
import com.smartpizza.dto.response.CategoryResponse;
import com.smartpizza.entity.Category;
import com.smartpizza.exception.BadRequestException;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.mapper.CategoryMapper;
import com.smartpizza.repository.CategoryRepository;
import com.smartpizza.repository.PizzaRepository;
import com.smartpizza.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final PizzaRepository pizzaRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A category with this name already exists");
        }
        Category category = categoryMapper.toEntity(request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return categoryMapper.toResponse(findCategoryOrThrow(id));
    }

    @Override
    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findCategoryOrThrow(id);
        boolean nameChanged = !category.getName().equalsIgnoreCase(request.getName());
        if (nameChanged && categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A category with this name already exists");
        }
        categoryMapper.updateEntity(category, request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = findCategoryOrThrow(id);
        if (pizzaRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Cannot delete a category that still has pizzas assigned to it");
        }
        categoryRepository.delete(category);
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }
}
