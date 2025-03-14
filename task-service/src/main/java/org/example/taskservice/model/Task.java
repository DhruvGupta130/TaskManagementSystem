package org.example.taskservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private long assigneeId;

    @Column(nullable = false)
    private long managerId;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private boolean completed;
    private boolean overdue;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    @Future(message = "Due date should always be in future")
    private LocalDateTime dueDate;

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private TaskExtension extension;

    public boolean isOverdue() {
        return dueDate.isBefore(LocalDateTime.now());
    }

    public enum Priority {
        HIGH, MEDIUM, LOW
    }
}
