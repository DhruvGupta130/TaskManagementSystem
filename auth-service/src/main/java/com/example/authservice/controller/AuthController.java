package com.example.authservice.controller;

import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.Response;
import com.example.authservice.dto.SignupRequest;
import com.example.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response> signup(@Valid @RequestBody SignupRequest request) {
        Response response = authService.signup(request);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody @Valid LoginRequest request, HttpServletResponse servletResponse) {
        Response response = authService.login(request, servletResponse);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Response> refresh(HttpServletRequest request) {
        Response response = authService.refresh(request);
        return ResponseEntity.status(response.status()).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Response> logout(HttpServletResponse servletResponse) {
        Response response = authService.logout(servletResponse);
        return ResponseEntity.status(response.status()).body(response);
    }

}