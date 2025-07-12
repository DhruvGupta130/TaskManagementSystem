package com.example.authservice.dto;

import com.example.authservice.enums.Role;
import com.example.authservice.model.LoginUser;

import java.io.Serializable;
import java.util.UUID;

public record UserInfo(
        UUID id,
        String email,
        Role role,
        String name) implements Serializable {
    public UserInfo(LoginUser user) {
        this(user.getId(), user.getEmail(), user.getRole(), user.getName());
    }
}
