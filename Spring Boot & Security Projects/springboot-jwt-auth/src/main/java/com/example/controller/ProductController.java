package com.example.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.model.Product;
import com.example.repository.ProductRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")

    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")

    public ResponseEntity<List<Product>>
    getAllProducts() {

        return ResponseEntity.ok(
                productRepository.findAll());
    }
}