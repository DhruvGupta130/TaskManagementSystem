package org.example.userservice.controller;

import lombok.AllArgsConstructor;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.service.AuthService;
import org.example.userservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/{userId}")
    public UserDTO getUserByUserId(@PathVariable long userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/user/{username}")
    public UserDTO getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @GetMapping("/{username}/tasks")
    public List<?> getUserWithTasks(@RequestHeader("Authorization") String token, @PathVariable String username) {
        return userService.getUserWithTasks(username, token);
    }

    @GetMapping("/me")
    public UserDTO getUserDetails(@RequestHeader("Authorization") String token) {
        String username = authService.getUserName(token);
        return userService.getUserByUsername(username);
    }
}