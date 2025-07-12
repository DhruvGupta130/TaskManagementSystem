package com.example.authservice.dto;

import org.springframework.http.HttpStatus;

import java.util.Map;

public record Response(
        String message,
        HttpStatus status,
        Map<String, ?> data
) {}
