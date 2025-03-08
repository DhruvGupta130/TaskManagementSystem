package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.Task;
import org.example.userservice.dto.TaskAssignmentRequest;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getManagedUsers() {
        return ResponseEntity.ok(userService.getAllRegularUsers());
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks(@RequestParam long managerId) {
        List<Task> tasks = userService.getTasksByManager(managerId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/assign-task")
    public ResponseEntity<Task> assignTask(@RequestBody TaskAssignmentRequest request) {
        Task assignedTask = userService.assignTask(request);
        return ResponseEntity.ok(assignedTask);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable long userId) {
        userService.deleteRegularUser(userId);
        return ResponseEntity.noContent().build();
    }
}