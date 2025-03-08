package org.example.userservice.controller;

import lombok.AllArgsConstructor;
import org.example.userservice.dto.Login;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.model.LoginUser;
import org.example.userservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody LoginUser user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Login login) {
        return new ResponseEntity<>(authService.login(login.getUsername(), login.getPassword()), HttpStatus.ACCEPTED);
    }

    @PutMapping("/change")
    public ResponseEntity<Void> changePassword(@RequestHeader("Authorization") String token, @RequestBody String password) {
        authService.updateUserPassword(token, password);
        return ResponseEntity.ok().build();
    }
}
