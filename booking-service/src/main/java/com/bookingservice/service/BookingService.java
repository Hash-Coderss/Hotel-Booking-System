package com.bookingservice.service;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.exception.BadRequestException;
import com.bookingservice.repository.BookingRepository;
import com.bookingservice.repository.HotelClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelClient hotelClient;

    public Bookings createBooking(BookingDTO dto, Long tokenUserId, String tokenRole, String authorization) {

        // For USER role, always use the userId from the JWT token (ignore body userId)
        // For ADMIN role, allow specifying a userId in the body; fallback to token userId
        Long bookingUserId;

        if ("USER".equalsIgnoreCase(tokenRole)) {
            // Regular users can only book for themselves
            if (dto.getUserId() != null && !dto.getUserId().equals(tokenUserId)) {
                throw new BadRequestException("Users can create bookings only for themselves");
            }
            bookingUserId = tokenUserId;
        } else {
            // Admin can specify userId explicitly, or it defaults to their own
            bookingUserId = (dto.getUserId() != null) ? dto.getUserId() : tokenUserId;
        }

        if (bookingUserId == null) {
            throw new BadRequestException("userId could not be determined");
        }

        // Validate hotel exists via feign (hotel-service is the source of truth for hotels)
        hotelClient.getHotel(dto.getHotelId(), authorization);

        Bookings booking = new Bookings();
        booking.setUserId(bookingUserId);
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
