package org.example.userservice.service;

import feign.FeignException;
import feign.Request;
import feign.RequestTemplate;
import org.example.userservice.client.UserClient;
import org.example.userservice.dto.Role;
import org.example.userservice.dto.UserInfo;
import org.example.userservice.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceSpringBootTest {

    @Autowired
    private UserService userService;

    @MockitoBean
    private UserClient userClient;

    private final UUID userId = UUID.randomUUID();

    @Test
    void shouldReturnUserById() {
        UserInfo mockUser = new UserInfo(userId, "test@example.com", Role.WORKER, "Test User");
        when(userClient.getUserById(userId)).thenReturn(mockUser);

        UserInfo result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals("test@example.com", result.email());
        verify(userClient).getUserById(userId);
    }

    @Test
    void shouldThrowResourceNotFoundException_whenUserByIdNotFound() {
        FeignException notFound = mockFeignException(404, "{\"message\":\"User not found\"}");
        when(userClient.getUserById(userId)).thenThrow(notFound);

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> userService.getUserById(userId));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void shouldThrowRuntimeException_whenUserByIdFailsWith500() {
        FeignException serverError = mockFeignException(500, "{\"message\":\"Internal error\"}");
        when(userClient.getUserById(userId)).thenThrow(serverError);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.getUserById(userId));
        assertTrue(ex.getMessage().contains("auth-service error: Internal error"));
    }

    @Test
    void shouldReturnAllWorkers() {
        List<UserInfo> workers = List.of(
                new UserInfo(UUID.randomUUID(), "w1@test.com", Role.WORKER, "Worker 1")
        );
        when(userClient.findAllWorkers()).thenReturn(workers);

        List<UserInfo> result = userService.getAllWorkers();
        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnAllManagers() {
        List<UserInfo> managers = List.of(
                new UserInfo(UUID.randomUUID(), "m1@test.com", Role.MANAGER, "Manager 1")
        );
        when(userClient.findAllManagers()).thenReturn(managers);

        List<UserInfo> result = userService.getAllManagers();
        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnUserByUsername() {
        UserInfo user = new UserInfo(UUID.randomUUID(), "name@example.com", Role.WORKER, "Name");
        when(userClient.getUserByUsername("name")).thenReturn(user);

        UserInfo result = userService.getUserByUsername("name");

        assertEquals("name@example.com", result.email());
    }

    // -- Helper to mock FeignException
    private FeignException mockFeignException(int status, String body) {
        return FeignException.errorStatus("GET", feign.Response.builder()
                .status(status)
                .reason("mock")
                .request(Request.create(Request.HttpMethod.GET, "/", Collections.emptyMap(), null, new RequestTemplate()))
                .body(body, StandardCharsets.UTF_8)
                .build());
    }
}