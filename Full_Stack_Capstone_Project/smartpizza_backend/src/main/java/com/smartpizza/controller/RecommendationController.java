package com.smartpizza.controller;

import com.smartpizza.dto.response.RecommendationResponse;
import com.smartpizza.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Recommendations", description = "AI recommendation engine (history, category, trending, scoring)")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    @Operation(summary = "Personalized recommendations (trending for new customers)")
    public ResponseEntity<List<RecommendationResponse>> recommend(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.recommend(principal.getUsername(), limit));
    }

    @GetMapping("/trending")
    @Operation(summary = "Trending pizzas: most ordered + highest rated")
    public ResponseEntity<List<RecommendationResponse>> trending(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.trending(limit));
    }

    @GetMapping("/history-based")
    @Operation(summary = "Recommendations from the user's order history")
    public ResponseEntity<List<RecommendationResponse>> historyBased(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.historyBased(principal.getUsername(), limit));
    }

    @GetMapping("/category-based")
    @Operation(summary = "Recommendations from the user's favourite categories")
    public ResponseEntity<List<RecommendationResponse>> categoryBased(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.categoryBased(principal.getUsername(), limit));
    }
}
