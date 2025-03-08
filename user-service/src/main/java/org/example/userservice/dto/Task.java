package org.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    private Long id;
    private String title;
    private String description;
    private String priority;
    private boolean completed;
    private boolean overdue;
    private LocalDateTime lastUpdated;
    private LocalDateTime dueDate;
}