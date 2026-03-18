package com.shopai.controller;

import com.shopai.model.*;
import com.shopai.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    // POST /api/orders/checkout
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> req) {
        Long userId = Long.valueOf(req.get("userId").toString());
        String address = req.get("address").toString();
        String paymentMethod = req.get("paymentMethod").toString();

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart is empty"));
        }

        User user = userRepository.findById(userId).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(Order.OrderStatus.CONFIRMED);

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Cart cart : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cart.getProduct());
            item.setQuantity(cart.getQuantity());
            item.setPrice(cart.getProduct().getPrice());
            total = total.add(cart.getProduct().getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
            items.add(item);
        }

        order.setTotalAmount(total);
        order.setItems(items);
        orderRepository.save(order);

        // Clear cart after order
        cartRepository.deleteByUserId(userId);

        return ResponseEntity.ok(Map.of(
            "message", "Order placed successfully!",
            "orderId", order.getId(),
            "totalAmount", total
        ));
    }

    // GET /api/orders/{userId}
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
