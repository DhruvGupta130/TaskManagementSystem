package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.userservice.client.UserClient;
import org.example.userservice.dto.UpdateUser;
import org.example.userservice.dto.UserInfo;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserClient userClient;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfo> getUserByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<UserInfo> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfo> getUserDetails(Principal principal) {
        return ResponseEntity.ok(userService.getUserByUsername(principal.getName()));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, ?>> updateUser(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UpdateUser user) {
        return ResponseEntity.ok(userClient.updateUser(user, UUID.fromString(jwt.getClaimAsString("id"))));
    }
}