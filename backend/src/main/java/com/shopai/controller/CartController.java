package com.shopai.controller;

import com.shopai.model.Cart;
import com.shopai.model.Product;
import com.shopai.model.User;
import com.shopai.repository.CartRepository;
import com.shopai.repository.ProductRepository;
import com.shopai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // GET /api/cart/{userId}
    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // POST /api/cart/add
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Long> req) {
        Long userId = req.get("userId");
        Long productId = req.get("productId");

        Optional<Cart> existing = cartRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setQuantity(cart.getQuantity() + 1);
            cartRepository.save(cart);
            return ResponseEntity.ok(cart);
        }

        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(1);
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    // DELETE /api/cart/remove/{cartId}
    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartId) {
        cartRepository.deleteById(cartId);
        return ResponseEntity.ok(Map.of("message", "Removed from cart"));
    }

    // DELETE /api/cart/clear/{userId}
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartRepository.deleteByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
