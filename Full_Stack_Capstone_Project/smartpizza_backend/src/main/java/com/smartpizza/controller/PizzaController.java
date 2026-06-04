package com.smartpizza.controller;

import com.smartpizza.dto.request.PizzaRequest;
import com.smartpizza.dto.response.PageResponse;
import com.smartpizza.dto.response.PizzaResponse;
import com.smartpizza.service.PizzaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/pizzas")
@RequiredArgsConstructor
@Tag(name = "Pizzas", description = "Pizza catalog: CRUD, search, filtering, pagination & sorting")
public class PizzaController {

    private final PizzaService pizzaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a pizza (ADMIN only)")
    public ResponseEntity<PizzaResponse> create(@Valid @RequestBody PizzaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pizzaService.create(request));
    }

    @GetMapping
    @Operation(summary = "List pizzas (paginated). Example: ?page=0&size=10&sort=price,asc")
    public ResponseEntity<PageResponse<PizzaResponse>> getAll(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(pizzaService.getAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single pizza by id")
    public ResponseEntity<PizzaResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pizzaService.getById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & filter pizzas by name, category, veg/non-veg and price range "
            + "(supports pagination & sorting)")
    public ResponseEntity<PageResponse<PizzaResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean veg,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(pizzaService.search(name, categoryId, veg, minPrice, maxPrice, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing pizza (ADMIN only)")
    public ResponseEntity<PizzaResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody PizzaRequest request) {
        return ResponseEntity.ok(pizzaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a pizza (ADMIN only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pizzaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
