package org.example.userservice.client;

import org.example.userservice.dto.Task;
import org.example.userservice.dto.TaskAssignmentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "task-service")
public interface TaskClient {

    @GetMapping("/api/tasks/user/tasks")
    List<Task> getTasksByUser(@RequestHeader("Authorization") String token);

    @DeleteMapping("/api/tasks/user/{userId}")
    void deleteUserTasks(@PathVariable long userId);

    @DeleteMapping("/api/tasks/manager/{userId}")
    void deleteManagerTasks(@PathVariable long userId);

    @GetMapping("/api/tasks/manager")
    List<Task> getTasksByManager(@RequestHeader("Authorization") String token);

    @PostMapping("/api/tasks/assign-task")
    Task assignTask(@RequestHeader("Authorization") String token, @RequestBody TaskAssignmentRequest request);
}
