package com.shopai.controller;

import com.shopai.config.JwtUtil;
import com.shopai.model.User;
import com.shopai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        if (userRepository.existsByEmail(req.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        User user = new User();
        user.setName(req.get("name"));
        user.setEmail(req.get("email"));
        user.setPassword(passwordEncoder.encode(req.get("password")));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "name", user.getName(), "email", user.getEmail()));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        Optional<User> userOpt = userRepository.findByEmail(req.get("email"));
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.get("password"), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "name", user.getName(), "email", user.getEmail(), "id", user.getId()));
    }
}
