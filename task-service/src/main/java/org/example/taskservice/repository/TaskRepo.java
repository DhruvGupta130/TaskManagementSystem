package org.example.taskservice.repository;

import org.example.taskservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Long> {

    List<Task> findByAssigneeId(long assigneeId);

    List<Task> findByDueDateBeforeAndCompletedFalse(LocalDateTime now);
}
