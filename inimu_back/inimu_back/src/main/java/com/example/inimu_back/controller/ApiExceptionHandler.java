package com.example.inimu_back.controller;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.putIfAbsent(error.getField(), normalizeMessage(error.getDefaultMessage()))
        );
        return ResponseEntity.badRequest().body((Map) errors);
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ReservationNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
                "error", "予約が見つかりません"
        ));
    }

    private String normalizeMessage(String message) {
        if (message == null) {
            return "不正な値です";
        }
        return message.endsWith("。") ? message.substring(0, message.length() - 1) : message;
    }
}
