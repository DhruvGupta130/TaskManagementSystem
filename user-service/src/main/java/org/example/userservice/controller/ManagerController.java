package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.model.LoginUser;
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
    public List<UserDTO> getManagedUsers() {
        return userService.getAllRegularUsers();
    }

    @PutMapping("/users/{userId}")
    public UserDTO updateUser(@PathVariable long userId, @RequestBody LoginUser updatedUser) {
        return userService.updateRegularUser(userId, updatedUser);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable long userId) {
        userService.deleteRegularUser(userId);
        return ResponseEntity.noContent().build();
    }
}