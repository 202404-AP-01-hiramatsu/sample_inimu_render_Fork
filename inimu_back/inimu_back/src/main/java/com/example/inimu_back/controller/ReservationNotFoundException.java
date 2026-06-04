package com.example.inimu_back.controller;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(Long id) {
        super("Reservation not found: " + id);
    }
}
