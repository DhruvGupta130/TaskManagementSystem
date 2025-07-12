package org.example.taskservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.taskservice.dto.Priority;
import org.example.taskservice.dto.TaskStatus;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private UUID assigneeId;

    @Column(nullable = false)
    private UUID managerId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Builder.Default
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.ASSIGNED;

    @Column(columnDefinition = "TEXT")
    private String rejectionNote;

    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String completionNote;

    private String submissionUrl;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private TaskExtension extension;

    public boolean isOverDue() {
        return dueDate.isBefore(LocalDate.now());
    }

    public boolean isCompleted() {
        return status == TaskStatus.COMPLETED;
    }
}
