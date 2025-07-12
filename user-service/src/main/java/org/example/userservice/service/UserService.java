package org.example.userservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.AllArgsConstructor;
import org.example.userservice.client.UserClient;
import org.example.userservice.dto.UserInfo;
import org.example.userservice.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserClient userClient;

    // Fetch user by username
    public UserInfo getUserByUsername(String username) {
        try {
            return userClient.getUserByUsername(username);
        } catch (FeignException ex) {
            String message = extractErrorMessage(ex);
            if (ex.status() == 404) {
                throw new ResourceNotFoundException(message);
            } else {
                throw new RuntimeException("auth-service error: " + message);
            }
        }
    }

    // Fetch user by ID
    public UserInfo getUserById(UUID userId) {
        try {
            return userClient.getUserById(userId);
        } catch (FeignException ex) {
            String message = extractErrorMessage(ex);
            if (ex.status() == 404) {
                throw new ResourceNotFoundException(message);
            } else {
                throw new RuntimeException("auth-service error: " + message);
            }
        }
    }

    public List<UserInfo> getAllWorkers() {
        try {
            return userClient.findAllWorkers();
        } catch (FeignException ex) {
            String message = extractErrorMessage(ex);
            if (ex.status() == 404) {
                throw new ResourceNotFoundException(message);
            } else {
                throw new RuntimeException("auth-service error: " + message);
            }
        }
    }

    public List<UserInfo> getAllManagers() {
        try {
            return userClient.findAllManagers();
        } catch (FeignException ex) {
            String message = extractErrorMessage(ex);
            if (ex.status() == 404) {
                throw new ResourceNotFoundException(message);
            } else {
                throw new RuntimeException("auth-service error: " + message);
            }
        }
    }

    private String extractErrorMessage(FeignException ex) {
        try {
            String content = ex.contentUTF8();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(content);
            return root.path("message").asText("Unknown error");
        } catch (Exception e) {
            return "Unknown error";
        }
    }
}