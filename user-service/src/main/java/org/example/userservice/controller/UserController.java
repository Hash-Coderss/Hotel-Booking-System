package org.example.userservice.controller;

import org.example.userservice.security.JwtUtil;
import org.example.userservice.modal.User;
import org.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUser(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authorization) {
        String token = jwtUtil.extractBearerToken(authorization);
        Long userId = jwtUtil.extractUserId(token);
        String email = jwtUtil.extractEmail(token);

        User user = userService.getUserById(userId);
        if (!user.getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token user mismatch");
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id,
            @RequestBody User user) {

        String token = jwtUtil.extractBearerToken(authorization);
        Long tokenUserId = jwtUtil.extractUserId(token);
        String role = jwtUtil.extractRole(token);

        if ("USER".equalsIgnoreCase(role) && !tokenUserId.equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Users can update only their own profile");
        }

        return ResponseEntity.ok(userService.updateUser(id, user));
    }
}
