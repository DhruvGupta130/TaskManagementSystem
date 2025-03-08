package org.example.userservice.client;

import org.example.userservice.dto.Task;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "task-service")
public interface TaskClient {

    @GetMapping("/api/tasks/user/{userId}")
    List<Task> getTasksById(@PathVariable long userId);

    @DeleteMapping("/api/tasks/user/{userId}")
    ResponseEntity<Void> deleteTasks(@PathVariable long userId);
}
