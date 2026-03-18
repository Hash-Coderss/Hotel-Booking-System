package com.bookingservice.controller;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.security.JwtUtil;
import com.bookingservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Bookings> createBooking(
            @RequestHeader("Authorization") String authorization,
            @RequestBody BookingDTO dto) {

        String token = jwtUtil.extractBearerToken(authorization);
        Long userId = jwtUtil.extractUserId(token);
        String role = jwtUtil.extractRole(token);
        return ResponseEntity.ok(bookingService.createBooking(dto, userId, role, authorization));
    }

    @GetMapping
    public ResponseEntity<List<Bookings>> getBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bookings> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingDTO dto) {

        return ResponseEntity.ok(bookingService.updateBooking(id, dto));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Bookings> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}