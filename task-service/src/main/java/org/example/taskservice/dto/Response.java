package org.example.taskservice.dto;

import org.springframework.http.HttpStatus;

public record Response(
        String message,
        HttpStatus status
) {}