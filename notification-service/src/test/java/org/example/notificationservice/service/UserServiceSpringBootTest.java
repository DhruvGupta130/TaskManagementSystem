package org.example.notificationservice.service;

import org.example.notificationservice.client.UserClient;
import org.example.notificationservice.dto.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceSpringBootTest {

    @Autowired
    private UserService userService;

    @MockitoBean
    private UserClient userClient;

    @Test
    void shouldReturnUserOnSuccess() {
        UUID userId = UUID.randomUUID();
        User expected = new User(userId, "success@example.com", "Success User", User.Role.WORKER);

        when(userClient.getUserById(userId)).thenReturn(expected);

        User result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals("success@example.com", result.email());
        verify(userClient).getUserById(userId);
    }

    @Test
    void shouldTriggerFallbackOnFailure() {
        UUID userId = UUID.randomUUID();

        when(userClient.getUserById(userId))
                .thenThrow(new RuntimeException("Service failure"));

        User result = userService.getUserById(userId);

        assertNull(result);
        verify(userClient).getUserById(userId);
    }
}