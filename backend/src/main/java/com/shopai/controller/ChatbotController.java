package com.shopai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // POST /api/chatbot/message
    @PostMapping("/message")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> req) {
        try {
            String url = mlServiceUrl + "/chat";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(req, headers);
            ResponseEntity<Object> response = restTemplate.postForEntity(url, entity, Object.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            // Fallback simple responses
            String msg = req.getOrDefault("message", "").toLowerCase();
            String reply;
            if (msg.contains("order")) reply = "Your order is being processed. Check My Orders for details!";
            else if (msg.contains("return")) reply = "We offer 30-day easy returns on all products!";
            else if (msg.contains("delivery")) reply = "Standard delivery takes 3-5 business days.";
            else if (msg.contains("payment")) reply = "We accept UPI, Credit/Debit cards, and COD.";
            else reply = "Hi! I'm ShopAI assistant. How can I help you today?";
            return ResponseEntity.ok(Map.of("reply", reply));
        }
    }
}
