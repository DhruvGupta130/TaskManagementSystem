package org.example.taskservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExtensionRequestDto {
    private LocalDateTime requestedDueDate;
    private String reason;
}
