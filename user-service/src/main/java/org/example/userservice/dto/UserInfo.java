package org.example.userservice.dto;

import java.util.UUID;

public record UserInfo(
        UUID id,
        String email,
        Role role,
        String name
) {}
