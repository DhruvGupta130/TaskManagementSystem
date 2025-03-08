package org.example.userservice.client;

import org.example.userservice.dto.Task;
import org.example.userservice.dto.TaskAssignmentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "task-service")
public interface TaskClient {

    @GetMapping("/api/tasks/user/{userId}")
    List<Task> getTasksById(@PathVariable long userId);

    @DeleteMapping("/api/tasks/user/{userId}")
    void deleteTasks(@PathVariable long userId);

    @GetMapping("/api/tasks/manager/{managerId}")
    List<Task> getTasksByManager(@PathVariable long managerId);

    @PostMapping("/api/tasks/assign-task")
    Task assignTask(TaskAssignmentRequest request);
}
