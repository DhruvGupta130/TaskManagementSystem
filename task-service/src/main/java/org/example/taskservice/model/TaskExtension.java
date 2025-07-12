package org.example.taskservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.taskservice.dto.ExtensionStatus;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskExtension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, unique = true)
    private Task task;

    @Column(nullable = false)
    private LocalDate requestedDueDate;

    @Column(nullable = false, length = 1024)
    private String reason;

    @Column(length = 1024)
    private String rejectReason;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExtensionStatus status = ExtensionStatus.PENDING;
}
