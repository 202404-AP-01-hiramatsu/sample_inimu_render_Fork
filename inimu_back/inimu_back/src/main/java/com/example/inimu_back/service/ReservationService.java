package com.example.inimu_back.service;

import com.example.inimu_back.dto.ReservationRequest;
import com.example.inimu_back.dto.ReservationResponse;
import com.example.inimu_back.entity.Reservation;
import com.example.inimu_back.repository.ReservationRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public ReservationResponse create(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setName(request.getName());
        reservation.setEmail(request.getEmail());
        reservation.setPreferredDate(request.getPreferredDate());
        reservation.setPeople(request.getPeople());
        reservation.setMessage(request.getMessage());
        reservation.setStatus("RECEIVED");
        reservation.setCreatedAt(LocalDateTime.now());

        return toResponse(reservationRepository.save(reservation));
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<ReservationResponse> findById(Long id) {
        return reservationRepository.findById(id).map(this::toResponse);
    }

    private ReservationResponse toResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setName(reservation.getName());
        response.setEmail(reservation.getEmail());
        response.setPreferredDate(reservation.getPreferredDate());
        response.setPeople(reservation.getPeople());
        response.setMessage(reservation.getMessage());
        response.setStatus(reservation.getStatus());
        response.setCreatedAt(reservation.getCreatedAt());
        return response;
    }
}
