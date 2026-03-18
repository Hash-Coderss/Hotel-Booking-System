package org.example.userservice.repository;

import org.hotelbooking.authservice.dto.AuthResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @GetMapping("/auth/{id}")
    AuthResponse getUserById(@PathVariable Long id);
}
