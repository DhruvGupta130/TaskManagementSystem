package org.example.taskservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.taskservice.dto.Response;
import org.example.taskservice.dto.TaskDetails;
import org.example.taskservice.dto.TaskRequest;
import org.example.taskservice.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks/manager")
public class ManagerController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDetails>> getTasksByManager(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(taskService.getTasksByManager(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDetails> getTaskByUserId(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskByUserId(UUID.fromString(jwt.getClaimAsString("id")), taskId));
    }

    @PostMapping("/assign-task")
    public ResponseEntity<Response> createTask(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody TaskRequest task) {
        Response response = taskService.createTask(UUID.fromString(jwt.getClaimAsString("id")), task);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Response> updateTask(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId, @Valid @RequestBody TaskRequest request) {
        Response response = taskService.updateTask(UUID.fromString(jwt.getClaimAsString("id")), taskId, request);
        return ResponseEntity.status(response.status()).body(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Response> deleteTasksForUser(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId) {
        Response response = taskService.deleteTask(UUID.fromString(jwt.getClaimAsString("id")), taskId);
        return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/extension-requests")
    public ResponseEntity<List<TaskDetails>> getExtensionRequests(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(taskService.getAllExtensionRequest(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @PutMapping("/extension/approve/{taskId}")
    public ResponseEntity<Response> approveExtensionRequest(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId) {
        Response response = taskService.approveExtensionRequest(UUID.fromString(jwt.getClaimAsString("id")), taskId);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/extension/reject/{taskId}")
    public ResponseEntity<Response> rejectExtensionRequest(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId, @RequestBody String reason) {
        Response response = taskService.rejectExtensionRequest(UUID.fromString(jwt.getClaimAsString("id")), taskId, reason);
        return ResponseEntity.status(response.status()).body(response);
    }

    @GetMapping("/submittedTasks")
    public ResponseEntity<List<TaskDetails>> getAllSubmittedTasks(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(taskService.getAllSubmittedTasks(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @PutMapping("/task/approve/{taskId}")
    public ResponseEntity<Response> approveSubmittedTask(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId) {
        Response response = taskService.approveSubmittedTask(UUID.fromString(jwt.getClaimAsString("id")), taskId);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PutMapping("/task/reject/{taskId}")
    public ResponseEntity<Response> rejectSubmittedTask(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId, @RequestBody String reason) {
        Response response = taskService.rejectSubmittedTask(UUID.fromString(jwt.getClaimAsString("id")), taskId, reason);
        return ResponseEntity.status(response.status()).body(response);
    }
}
