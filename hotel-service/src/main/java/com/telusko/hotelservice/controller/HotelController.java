package com.telusko.hotelservice.controller;

import com.telusko.hotelservice.dto.HotelDTO;
import com.telusko.hotelservice.model.Hotel;
import com.telusko.hotelservice.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HotelController {

    private final HotelService service;

    public HotelController(HotelService service) {
        this.service = service;
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public HotelDTO addHotel(@RequestBody HotelDTO dto) {
        return service.addHotel(dto);
    }

    @GetMapping
    public List<HotelDTO> getHotels(@RequestParam(required = false) String city) {
        if (city != null) {
            return service.getHotelsByCity(city);
        }
        return service.getAllHotels();
    }

    @GetMapping("/{id}")
    public HotelDTO getHotel(@PathVariable Long id) {
        return service.getHotelById(id);
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public HotelDTO updateHotel(@PathVariable Long id, @RequestBody HotelDTO dto) {
        return service.updateHotel(id, dto);
    }

    // 🔒 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteHotel(@PathVariable Long id) {
        service.deleteHotel(id);
        return "Deleted successfully";
    }
}
