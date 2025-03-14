package org.example.taskservice.repository;

import jakarta.validation.constraints.Future;
import org.example.taskservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Long> {

    List<Task> findByAssigneeId(long assigneeId);

    List<Task> findByDueDateBeforeAndCompletedAndManagerId(
            @Future(message = "Due date should always be in future")
            LocalDateTime dueDateBefore,
            boolean completed,
            long managerId
    );

    List<Task> findByManagerId(Long managerId);

    List<Task> findByDueDateBeforeAndCompleted(
            @Future(message = "Due date should always be in future")
            LocalDateTime dueDateBefore,
            boolean completed
    );
}
