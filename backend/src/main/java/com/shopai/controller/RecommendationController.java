package com.shopai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // GET /api/recommendations/{userId}
    // Calls Python ML microservice
    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long userId) {
        try {
            String url = mlServiceUrl + "/recommend/" + userId;
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("error", "ML service unavailable", "fallback", true));
        }
    }

    // GET /api/recommendations/also-bought/{productId}
    @GetMapping("/also-bought/{productId}")
    public ResponseEntity<?> getAlsoBought(@PathVariable Long productId) {
        try {
            String url = mlServiceUrl + "/also-bought/" + productId;
            Object response = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("error", "ML service unavailable"));
        }
    }
}
