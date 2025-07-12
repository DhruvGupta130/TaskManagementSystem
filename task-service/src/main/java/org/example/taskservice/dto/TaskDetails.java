package org.example.taskservice.dto;

import org.example.taskservice.model.Task;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

public record TaskDetails(
        Long id,
        String title,
        String description,
        User assignee,
        User manager,
        Priority priority,
        LocalDate dueDate,
        TaskStatus status,
        String rejectNote,
        String completionNote,
        String submissionUrl,
        Map<String, String> extension
) implements Serializable {
    public TaskDetails(Task task, User assignee, User manager) {
        this(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                assignee,
                manager,
                task.getPriority(),
                task.getDueDate(),
                task.getStatus(),
                task.getRejectionNote(),
                task.getSubmissionUrl(),
                task.getCompletionNote(),
                Optional.ofNullable(task.getExtension())
                        .map(ext -> Map.of(
                                "reason", Optional.ofNullable(ext.getReason()).orElse(""),
                                "rejectReason", Optional.ofNullable(ext.getRejectReason()).orElse(""),
                                "status", Optional.of(ext.getStatus().name()).orElse(""),
                                "requestedDate", Optional.of(ext.getRequestedDueDate().toString()).orElse("")
                        ))
                        .orElse(null)
        );
    }
}
