package org.example.taskservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record TaskRequest(
        @NotBlank(message = "Title must not be blank")
        String title,

        @NotBlank(message = "Description must not be blank")
        String description,

        @NotNull(message = "Assignee ID must not be null")
        UUID assigneeId,

        @NotNull(message = "Priority must not be null")
        Priority priority,

        @NotNull(message = "Due date must not be null")
        @Future(message = "Due date should always be in future")
        LocalDate dueDate
) {}