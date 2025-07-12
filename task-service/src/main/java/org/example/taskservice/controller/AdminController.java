package org.example.taskservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskservice.dto.TaskDetails;
import org.example.taskservice.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks/admin")
public class AdminController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDetails>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
}
