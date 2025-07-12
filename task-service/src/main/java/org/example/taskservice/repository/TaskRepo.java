package org.example.taskservice.repository;

import org.example.taskservice.dto.ExtensionStatus;
import org.example.taskservice.dto.TaskStatus;
import org.example.taskservice.model.Task;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepo extends JpaRepository<Task, Long> {
    List<Task> findByManagerId(UUID managerId);
    List<Task> findAllByExtension_Status(ExtensionStatus extensionStatus, Sort sort);
    List<Task> findAllByStatus(TaskStatus status, Sort sort);
    List<Task> findByAssigneeId(UUID assigneeId);
}
