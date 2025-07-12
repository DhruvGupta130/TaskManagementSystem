package org.example.taskservice.dto;

public record CompletionRequest(
        String notes,
        String submissionUrl
) {}
