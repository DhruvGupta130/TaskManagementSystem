package org.example.taskservice.controller;

import lombok.AllArgsConstructor;
import org.example.taskservice.dto.ExtensionRequestDto;
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
    public ResponseEntity<List<Task>> getAllTasks(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getAllTasks(token));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestHeader("Authorization") String token ,@RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(task, token));
    }

    @PostMapping("/assign-task")
    public ResponseEntity<Task> assignTask(@RequestHeader("Authorization") String token, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.assignTask(task, token));
    }

    @GetMapping("/manager")
    public ResponseEntity<List<Task>> getTasksByManager(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getTasksByManager(token));
    }

    //fetches all task of users
    @GetMapping("/user/tasks")
    public ResponseEntity<List<Task>> getTasksForUser(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getTasksForUser(token));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteTasksForUser(@PathVariable long userId) {
        taskService.deleteUserTasks(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/manager/{userId}")
    public ResponseEntity<Void> deleteTasksForManager(@PathVariable long userId) {
        taskService.deleteManagerTasks(userId);
        return ResponseEntity.ok().build();
    }

    //get user from task
    @GetMapping("/tasks/{taskId}/user")
    public ResponseEntity<User> getUser(@RequestHeader("Authorization") String token, @PathVariable long taskId) {
        return ResponseEntity.ok(taskService.getUserByTask(taskId, token));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<Task> getTask(@RequestHeader("Authorization") String token, @PathVariable long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId, token));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@RequestHeader("Authorization") String token, @PathVariable long taskId, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDetails, token));
    }

    @PutMapping("/tasks/{taskId}/user")
    public ResponseEntity<Task> updateTaskStatus(@RequestHeader("Authorization") String token, @PathVariable long taskId, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, taskDetails, token));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@RequestHeader("Authorization") String token, @PathVariable Long taskId) {
        taskService.deleteTask(taskId, token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getOverdueTasks(token));
    }

    @PostMapping("/{taskId}/request-extension")
    public ResponseEntity<Task> requestExtension(@RequestHeader("Authorization") String token, @PathVariable long taskId, @RequestBody ExtensionRequestDto request) {
        return ResponseEntity.ok(taskService.requestExtension(taskId, request, token));
    }

}