package org.example.taskservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class TaskExtension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnore
    @JoinColumn(nullable = false)
    private Task task;

    @Future(message = "Requested due date should be in the future")
    @Column(nullable = false)
    private LocalDateTime requestedDueDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
}
