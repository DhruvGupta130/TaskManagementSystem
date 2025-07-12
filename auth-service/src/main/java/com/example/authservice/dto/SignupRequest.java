package com.example.authservice.dto;

import com.example.authservice.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignupRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Role is required")
        Role role,

        @NotBlank(message = "Password is required")
        String password
) {}
