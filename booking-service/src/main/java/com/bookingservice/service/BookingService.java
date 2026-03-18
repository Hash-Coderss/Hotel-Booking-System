package com.bookingservice.service;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.repository.BookingRepository;
import com.bookingservice.repository.HotelClient;
import com.bookingservice.repository.UserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserClient userClient;
    private final HotelClient hotelClient;

    public Bookings createBooking(BookingDTO dto) {

        // Validate
        userClient.getUser(dto.getUserId());
        hotelClient.getHotel(dto.getHotelId());

        Bookings booking = new Bookings();
        booking.setUserId(dto.getUserId());
        booking.setHotelId(dto.getHotelId());
        booking.setCheckIn(dto.getCheckIn());
        booking.setCheckOut(dto.getCheckOut());
        booking.setPrice(dto.getPrice());
        booking.setStatus("BOOKED");

        return bookingRepository.save(booking);
    }

    public List<Bookings> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Bookings updateBooking(Long id, BookingDTO dto) {

        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Cannot update cancelled booking");
        }

        booking.setCheckIn(dto.getCheckIn());
        booking.setCheckOut(dto.getCheckOut());

        return bookingRepository.save(booking);
    }

    public Bookings cancelBooking(Long id) {

        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Booking already cancelled");
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

}
