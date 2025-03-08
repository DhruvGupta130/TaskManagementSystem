package org.example.userservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskAssignmentRequest {
    private long managerId;
    private long assigneeId;
    private String title;
    private String description;
    private String priority;
    private LocalDateTime dueDate;
}
