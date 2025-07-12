package org.example.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record NotificationRequest(

        @NotBlank(message = "Message cannot be null")
        String message,

        @NotNull(message = "Recipient cannot be null")
        UUID recipientId,

        boolean read
) {}
