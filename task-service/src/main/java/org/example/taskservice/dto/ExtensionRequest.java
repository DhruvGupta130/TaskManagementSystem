package org.example.taskservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ExtensionRequest(
        @NotBlank(message = "Reason cannot be empty")
        String reason,

        @Future(message = "Requested due date should be in the future")
        LocalDate requestedDueDate
) {}
