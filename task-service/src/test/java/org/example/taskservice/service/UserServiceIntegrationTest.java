package org.example.taskservice.service;

import org.example.taskservice.client.UserClient;
import org.example.taskservice.dto.Role;
import org.example.taskservice.dto.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceIntegrationTest {

    private final UUID userId1 = UUID.randomUUID();
    private final UUID userId2 = UUID.randomUUID();
    private final Set<UUID> ids = Set.of(userId1, userId2);

    @MockitoBean
    private UserClient userClient;

    @Autowired
    private UserService userService;

    @Test
    void shouldReturnUsersFromUserClient() {
        // Given
        Map<UUID, User> mockUsers = Map.of(
                userId1, new User(userId1, "user1@example.com", "User One", Role.WORKER),
                userId2, new User(userId2, "user2@example.com", "User Two", Role.MANAGER)
        );
        when(userClient.getUsersByIds(ids)).thenReturn(mockUsers);

        // When
        Map<UUID, User> result = userService.getUsersByIds(ids);

        // Then
        assertThat(result).hasSize(2).containsKeys(userId1, userId2);
        verify(userClient, times(1)).getUsersByIds(ids);
    }

    @Test
    void shouldTriggerFallbackWhenUserClientFails() {
        // Simulate failure
        when(userClient.getUsersByIds(ids)).thenThrow(new RuntimeException("User service down"));

        // When
        Map<UUID, User> fallbackResult = userService.getUsersByIds(ids);

        // Then
        assertThat(fallbackResult).isEmpty();
        verify(userClient, atLeastOnce()).getUsersByIds(ids);
    }
}