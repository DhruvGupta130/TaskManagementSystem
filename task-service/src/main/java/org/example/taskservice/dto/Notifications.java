package org.example.taskservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Notifications {
    private String message;
    private long recipientId;
    private boolean read;
    private LocalDateTime timestamp;
}
