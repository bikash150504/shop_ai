package com.shopai.controller;

import com.shopai.model.Product;
import com.shopai.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    // GET /api/products — all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET /api/products/{id} — single product
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/products/search?q=laptop
    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return productRepository.searchByKeyword(q);
    }

    // GET /api/products/top — top rated
    @GetMapping("/top")
    public List<Product> getTopProducts() {
        return productRepository.findTop8ByOrderByRatingDesc();
    }

    // GET /api/products/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // POST /api/products — add product (admin)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
