package org.example.taskservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.taskservice.dto.CompletionRequest;
import org.example.taskservice.dto.ExtensionRequest;
import org.example.taskservice.dto.Response;
import org.example.taskservice.dto.TaskDetails;
import org.example.taskservice.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks/worker")
public class WorkerController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDetails>> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(taskService.getTasksByWorker(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<TaskDetails> getTaskByUserId(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskByUserId(UUID.fromString(jwt.getClaimAsString("id")), taskId));
    }

    @PutMapping("/submit/{taskId}")
    public ResponseEntity<Response> submitTask(@AuthenticationPrincipal Jwt jwt, @PathVariable Long taskId, @RequestBody CompletionRequest request) {
        Response response = taskService.markTaskAsComplete(UUID.fromString(jwt.getClaimAsString("id")), taskId, request);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PostMapping("/{taskId}/request-extension")
    public ResponseEntity<Response> requestExtension(@AuthenticationPrincipal Jwt jwt, @PathVariable long taskId, @Valid @RequestBody ExtensionRequest request) {
        return ResponseEntity.ok(taskService.requestExtension(UUID.fromString(jwt.getClaimAsString("id")), taskId, request));
    }
}
