package org.example.taskservice.controller;

import lombok.AllArgsConstructor;
import org.example.taskservice.dto.User;
import org.example.taskservice.model.Task;
import org.example.taskservice.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public Task createTask(@RequestHeader("Authorization") String token ,@RequestBody Task task) {
        return taskService.createTask(task, token);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Task>> getTasksForUser(@PathVariable long userId) {
        return ResponseEntity.ok(taskService.getTasksForUser(userId));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteTasksForUser(@PathVariable long userId) {
        taskService.deleteUserTasks(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{taskId}")
    public ResponseEntity<User> getUser(@RequestHeader("Authorization") String token, @PathVariable long taskId) {
        return ResponseEntity.ok(taskService.getUserByTask(taskId, token));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<Task> getTask(@RequestHeader("Authorization") String token, @PathVariable long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId, token));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDetails));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }
}