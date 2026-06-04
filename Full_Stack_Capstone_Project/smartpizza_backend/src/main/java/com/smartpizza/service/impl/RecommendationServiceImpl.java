package com.smartpizza.service.impl;

import com.smartpizza.dto.response.RecommendationResponse;
import com.smartpizza.entity.OrderStatus;
import com.smartpizza.entity.Pizza;
import com.smartpizza.entity.User;
import com.smartpizza.exception.ResourceNotFoundException;
import com.smartpizza.repository.OrderItemRepository;
import com.smartpizza.repository.OrderItemRepository.CategoryCount;
import com.smartpizza.repository.OrderItemRepository.PizzaCount;
import com.smartpizza.repository.PizzaRepository;
import com.smartpizza.repository.UserRepository;
import com.smartpizza.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final OrderItemRepository orderItemRepository;
    private final PizzaRepository pizzaRepository;
    private final UserRepository userRepository;

    // Scoring weights (sum to 1.0), scaled to 0-100.
    private static final double W_CATEGORY = 0.40;
    private static final double W_POPULARITY = 0.25;
    private static final double W_RATING = 0.20;
    private static final double W_VEG = 0.15;

    private static final int RECENT_DAYS = 30;
    private static final int MIN_LIMIT = 1;
    private static final int MAX_LIMIT = 50;
    private static final OrderStatus EXCLUDED = OrderStatus.CANCELLED;

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationResponse> recommend(String userEmail, int limit) {
        int top = clampLimit(limit);
        User user = findUser(userEmail);

        long totalQty = orderItemRepository.sumUserQuantity(user.getId(), EXCLUDED);
        if (totalQty == 0) {
            // New customer -> trending
            return trendingInternal(top);
        }

        Map<Long, Long> categoryCounts = toCategoryCountMap(
                orderItemRepository.findUserCategoryCounts(user.getId(), EXCLUDED));
        long maxCat = maxValue(categoryCounts);

        long vegQty = orderItemRepository.sumUserVegQuantity(user.getId(), EXCLUDED);
        double vegFraction = (double) vegQty / totalQty;
        Boolean prefVeg = vegFraction >= 0.6 ? Boolean.TRUE : (vegFraction <= 0.4 ? Boolean.FALSE : null);

        Map<Long, Long> globalCounts = toPizzaCountMap(orderItemRepository.findGlobalPizzaCounts(EXCLUDED));
        long maxGlobal = maxValue(globalCounts);

        Set<Long> recent = recentlyPurchased(user.getId());

        return availablePizzas().stream()
                .filter(p -> !recent.contains(p.getId()))
                .map(p -> {
                    double catAffinity = maxCat > 0
                            ? (double) categoryCounts.getOrDefault(categoryId(p), 0L) / maxCat : 0.0;
                    double popularity = maxGlobal > 0
                            ? (double) globalCounts.getOrDefault(p.getId(), 0L) / maxGlobal : 0.0;
                    double ratingNorm = ratingNorm(p);
                    double vegMatch = prefVeg == null ? 0.5 : (p.isVeg() == prefVeg ? 1.0 : 0.0);

                    double cCat = W_CATEGORY * catAffinity;
                    double cPop = W_POPULARITY * popularity;
                    double cRate = W_RATING * ratingNorm;
                    double cVeg = W_VEG * vegMatch;
                    double score = round1(100.0 * (cCat + cPop + cRate + cVeg));

                    return toResponse(p, score, personalizedReason(cCat, cPop, cRate, cVeg, p, prefVeg));
                })
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(top)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationResponse> trending(int limit) {
        return trendingInternal(clampLimit(limit));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationResponse> historyBased(String userEmail, int limit) {
        int top = clampLimit(limit);
        User user = findUser(userEmail);

        if (orderItemRepository.sumUserQuantity(user.getId(), EXCLUDED) == 0) {
            return List.of();
        }

        Map<Long, Long> categoryCounts = toCategoryCountMap(
                orderItemRepository.findUserCategoryCounts(user.getId(), EXCLUDED));
        long maxCat = maxValue(categoryCounts);
        Map<Long, Long> globalCounts = toPizzaCountMap(orderItemRepository.findGlobalPizzaCounts(EXCLUDED));
        long maxGlobal = maxValue(globalCounts);
        Set<Long> recent = recentlyPurchased(user.getId());

        return availablePizzas().stream()
                .filter(p -> categoryCounts.containsKey(categoryId(p)))
                .filter(p -> !recent.contains(p.getId()))
                .map(p -> {
                    double catAffinity = maxCat > 0
                            ? (double) categoryCounts.getOrDefault(categoryId(p), 0L) / maxCat : 0.0;
                    double popularity = maxGlobal > 0
                            ? (double) globalCounts.getOrDefault(p.getId(), 0L) / maxGlobal : 0.0;
                    double ratingNorm = ratingNorm(p);
                    double score = round1(100.0 * (0.55 * catAffinity + 0.25 * popularity + 0.20 * ratingNorm));
                    return toResponse(p, score, "Based on your order history");
                })
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(top)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationResponse> categoryBased(String userEmail, int limit) {
        int top = clampLimit(limit);
        User user = findUser(userEmail);

        Map<Long, Long> categoryCounts = toCategoryCountMap(
                orderItemRepository.findUserCategoryCounts(user.getId(), EXCLUDED));
        if (categoryCounts.isEmpty()) {
            return List.of();
        }
        long maxCat = maxValue(categoryCounts);
        Set<Long> recent = recentlyPurchased(user.getId());

        return availablePizzas().stream()
                .filter(p -> categoryCounts.containsKey(categoryId(p)))
                .filter(p -> !recent.contains(p.getId()))
                .map(p -> {
                    double catAffinity = maxCat > 0
                            ? (double) categoryCounts.getOrDefault(categoryId(p), 0L) / maxCat : 0.0;
                    double ratingNorm = ratingNorm(p);
                    double score = round1(100.0 * (0.70 * catAffinity + 0.30 * ratingNorm));
                    String categoryName = p.getCategory() != null ? p.getCategory().getName() : "your favourites";
                    return toResponse(p, score, "From your favourite category: " + categoryName);
                })
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(top)
                .toList();
    }

    // ----- trending core -----

    private List<RecommendationResponse> trendingInternal(int top) {
        Map<Long, Long> globalCounts = toPizzaCountMap(orderItemRepository.findGlobalPizzaCounts(EXCLUDED));
        long maxGlobal = maxValue(globalCounts);

        return availablePizzas().stream()
                .map(p -> {
                    double popularity = maxGlobal > 0
                            ? (double) globalCounts.getOrDefault(p.getId(), 0L) / maxGlobal : 0.0;
                    double ratingNorm = ratingNorm(p);
                    double score = round1(100.0 * (0.60 * popularity + 0.40 * ratingNorm));
                    String reason;
                    if (popularity == 0 && ratingNorm == 0) {
                        reason = "Trending";
                    } else if (popularity * 0.60 >= ratingNorm * 0.40) {
                        reason = "Most ordered right now";
                    } else {
                        reason = "Highly rated";
                    }
                    return toResponse(p, score, reason);
                })
                .sorted(Comparator.comparingDouble(RecommendationResponse::getScore).reversed())
                .limit(top)
                .toList();
    }

    // ----- helpers -----

    private String personalizedReason(double cCat, double cPop, double cRate, double cVeg,
                                      Pizza p, Boolean prefVeg) {
        double max = Math.max(Math.max(cCat, cPop), Math.max(cRate, cVeg));
        if (max == 0) {
            return "Recommended for you";
        }
        if (cCat == max) {
            String name = p.getCategory() != null ? p.getCategory().getName() : "a category you like";
            return "Frequently ordered category: " + name;
        }
        if (cPop == max) {
            return "Popular right now";
        }
        if (cRate == max) {
            return "Highly rated";
        }
        if (prefVeg != null) {
            return "Matches your " + (prefVeg ? "veg" : "non-veg") + " preference";
        }
        return "Recommended for you";
    }

    private List<Pizza> availablePizzas() {
        return pizzaRepository.findAll().stream()
                .filter(Pizza::isAvailable)
                .toList();
    }

    private Set<Long> recentlyPurchased(Long userId) {
        Instant since = Instant.now().minus(Duration.ofDays(RECENT_DAYS));
        return new HashSet<>(orderItemRepository.findRecentlyPurchasedPizzaIds(userId, since, EXCLUDED));
    }

    private Map<Long, Long> toPizzaCountMap(List<PizzaCount> counts) {
        return counts.stream().collect(Collectors.toMap(PizzaCount::getPizzaId, PizzaCount::getTotalQuantity));
    }

    private Map<Long, Long> toCategoryCountMap(List<CategoryCount> counts) {
        return counts.stream()
                .filter(c -> c.getCategoryId() != null)
                .collect(Collectors.toMap(CategoryCount::getCategoryId, CategoryCount::getTotalQuantity));
    }

    private long maxValue(Map<Long, Long> map) {
        return map.values().stream().mapToLong(Long::longValue).max().orElse(0L);
    }

    private Long categoryId(Pizza p) {
        return p.getCategory() != null ? p.getCategory().getId() : null;
    }

    private double ratingNorm(Pizza p) {
        double r = p.getRating() == null ? 0.0 : p.getRating();
        return Math.max(0.0, Math.min(1.0, r / 5.0));
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private int clampLimit(int limit) {
        return Math.max(MIN_LIMIT, Math.min(limit, MAX_LIMIT));
    }

    private RecommendationResponse toResponse(Pizza p, double score, String reason) {
        return RecommendationResponse.builder()
                .pizzaId(p.getId())
                .pizzaName(p.getName())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .price(p.getPrice())
                .rating(p.getRating())
                .veg(p.isVeg())
                .imageUrl(p.getImageUrl())
                .score(score)
                .reason(reason)
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
