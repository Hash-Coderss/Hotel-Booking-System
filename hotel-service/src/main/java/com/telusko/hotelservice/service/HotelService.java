package com.telusko.hotelservice.service;

import com.telusko.hotelservice.dto.HotelDTO;
import com.telusko.hotelservice.mapper.HotelMapper;
import com.telusko.hotelservice.model.Hotel;
import com.telusko.hotelservice.repo.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository repo;

    public HotelService(HotelRepository repo) {
        this.repo = repo;
    }

    public HotelDTO addHotel(HotelDTO dto) {
        Hotel hotel = HotelMapper.toEntity(dto);
        return HotelMapper.toDTO(repo.save(hotel));
    }

    public List<HotelDTO> getAllHotels() {
        return repo.findAll()
                .stream()
                .map(HotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<HotelDTO> getHotelsByCity(String city) {
        return repo.findByCity(city)
                .stream()
                .map(HotelMapper::toDTO)
                .collect(Collectors.toList());
    }

    public HotelDTO getHotelById(Long id) {
        Hotel hotel = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return HotelMapper.toDTO(hotel);
    }

    public HotelDTO updateHotel(Long id, HotelDTO dto) {
        Hotel hotel = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setName(dto.getName());
        hotel.setCity(dto.getCity());
        hotel.setAddress(dto.getAddress());
        hotel.setPrice(dto.getPrice());
        hotel.setRating(dto.getRating());
        hotel.setDescription(dto.getDescription());

        return HotelMapper.toDTO(repo.save(hotel));
    }

    public void deleteHotel(Long id) {
        repo.deleteById(id);
    }
}
