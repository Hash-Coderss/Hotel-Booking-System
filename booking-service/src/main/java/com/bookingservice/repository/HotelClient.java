package com.bookingservice.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "hotel-service")
public interface HotelClient {

    @GetMapping("/hotel/{id}")
    Object getHotel(@PathVariable Long id, @RequestHeader("Authorization") String authorization);
}
