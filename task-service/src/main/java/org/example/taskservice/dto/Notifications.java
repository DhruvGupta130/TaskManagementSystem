package org.example.taskservice.dto;

import java.util.UUID;

public record Notifications(
        String message,
        UUID recipientId,
        boolean read
) {}
