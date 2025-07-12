package com.example.authservice.controller;

import com.example.authservice.dto.Response;
import com.example.authservice.dto.UpdateUser;
import com.example.authservice.dto.UserInfo;
import com.example.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/internal/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/users")
    public ResponseEntity<Map<UUID, UserInfo>> getUsersById(@RequestBody Set<UUID> ids) {
        return ResponseEntity.ok(userService.findUsersById(ids));
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserInfo> findById(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUserProfileById(userId));
    }

    @GetMapping("/username/{email}")
    public ResponseEntity<UserInfo> findByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserProfileByUsername(email));
    }

    @GetMapping("/workers")
    public ResponseEntity<List<UserInfo>> findAllWorker() {
        return ResponseEntity.ok(userService.getAllWorkers());
    }

    @GetMapping("/managers")
    public ResponseEntity<List<UserInfo>> findAllManager() {
        return ResponseEntity.ok(userService.getAllManagers());
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<Response> updateProfile(@Valid @RequestBody UpdateUser request, @PathVariable UUID userId) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }
}
