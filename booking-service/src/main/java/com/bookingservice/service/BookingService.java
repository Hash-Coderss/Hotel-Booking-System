package com.bookingservice.service;

import com.bookingservice.dto.BookingDTO;
import com.bookingservice.entity.Bookings;
import com.bookingservice.exception.BadRequestException;
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

    public Bookings createBooking(BookingDTO dto, Long tokenUserId, String tokenRole, String authorization) {

        try {
            Long bookingUserId = dto.getUserId();

            if ("USER".equalsIgnoreCase(tokenRole)) {
                if (bookingUserId != null && !bookingUserId.equals(tokenUserId)) {
                    throw new BadRequestException("Users can create bookings only for themselves");
                }
                bookingUserId = tokenUserId;
            }

            if (bookingUserId == null) {
                throw new BadRequestException("userId is required");
            }

            // 🔥 External service calls
            userClient.getUser(bookingUserId, authorization);
            hotelClient.getHotel(dto.getHotelId(), authorization);

            Bookings booking = new Bookings();
            booking.setUserId(bookingUserId);
            booking.setHotelId(dto.getHotelId());
            booking.setCheckIn(dto.getCheckIn());
            booking.setCheckOut(dto.getCheckOut());
            booking.setPrice(dto.getPrice());
            booking.setStatus("BOOKED");

            return bookingRepository.save(booking);

        } catch (BadRequestException e) {
            System.err.println("Bad Request: " + e.getMessage());
            throw e;

        } catch (Exception e) {
            // 🔥 THIS WILL SHOW REAL ERROR IN CONSOLE
            System.err.println("Error while creating booking:");
            e.printStackTrace();

            throw new RuntimeException("Failed to create booking: " + e.getMessage());
        }
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
