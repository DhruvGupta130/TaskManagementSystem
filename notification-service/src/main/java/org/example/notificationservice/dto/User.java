package org.example.notificationservice.dto;

import java.util.UUID;

public record User(
        UUID id,
        String email,
        String name,
        Role role) {
    public enum Role {
        WORKER, MANAGER, ADMIN
    }
}
