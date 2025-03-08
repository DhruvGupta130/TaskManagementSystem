package org.example.notificationservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private String message;
    private String recipient;
    private boolean read;
    private LocalDateTime timestamp;
}
