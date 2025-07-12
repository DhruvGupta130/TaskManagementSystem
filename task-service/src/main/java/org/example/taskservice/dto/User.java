package org.example.taskservice.dto;

import java.io.Serializable;
import java.util.UUID;

public record User(
        UUID id,
        String email,
        String name,
        Role role
) implements Serializable {}