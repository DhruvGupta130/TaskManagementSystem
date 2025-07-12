package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.UserInfo;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/workers")
    public ResponseEntity<List<UserInfo>> getAllWorker() {
        return ResponseEntity.ok(userService.getAllWorkers());
    }

    @GetMapping("/managers")
    public ResponseEntity<List<UserInfo>> getAllManager() {
        return ResponseEntity.ok(userService.getAllManagers());
    }

}