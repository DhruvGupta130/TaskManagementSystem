package org.example.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.notificationservice.dto.NotificationRequest;
import org.example.notificationservice.dto.User;
import org.example.notificationservice.kafka.DeadLetterProducer;
import org.example.notificationservice.kafka.NotificationConsumer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

import static org.mockito.Mockito.*;

public class NotificationConsumerTest {

    @InjectMocks
    private NotificationConsumer consumer;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private UserService userService;

    @Mock
    private DeadLetterProducer deadLetterProducer;

    @Mock
    private Acknowledgment acknowledgment;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void shouldProcessNotificationAndSendWebSocketMessage() throws Exception {
        UUID userId = UUID.randomUUID();
        String message = "{\"recipientId\":\"" + userId + "\",\"message\":\"Hi\",\"read\":false}";

        NotificationRequest request = new NotificationRequest("Hi", userId, false);
        User user = new User(userId, "user@example.com", "User", User.Role.WORKER);

        when(objectMapper.readValue(eq(message), eq(NotificationRequest.class))).thenReturn(request);
        when(userService.getUserById(userId)).thenReturn(user);

        consumer.consumeNotification(message, acknowledgment);

        verify(notificationService).saveNotification(request);
        verify(messagingTemplate).convertAndSendToUser(
                eq("user@example.com"), eq("/queue/notifications"), eq(request)
        );
        verify(acknowledgment).acknowledge();
    }

    @Test
    void shouldSendToDLTIfUserNotFound() throws Exception {
        UUID userId = UUID.randomUUID();
        String message = "{\"recipientId\":\"" + userId + "\",\"message\":\"Hi\",\"read\":false}";

        NotificationRequest request = new NotificationRequest("Hi", userId,  false);

        when(objectMapper.readValue(eq(message), eq(NotificationRequest.class))).thenReturn(request);
        when(userService.getUserById(userId)).thenReturn(null);

        consumer.consumeNotification(message, acknowledgment);

        verify(notificationService).saveNotification(request);
        verify(deadLetterProducer).send("notifications.DLT", request);
        verify(acknowledgment).acknowledge();
        verifyNoInteractions(messagingTemplate);
    }

    @Test
    void shouldLogErrorIfMessageProcessingFails() throws Exception {
        String invalidMessage = "invalid json";

        when(objectMapper.readValue(eq(invalidMessage), eq(NotificationRequest.class)))
                .thenThrow(new RuntimeException("Invalid JSON"));

        consumer.consumeNotification(invalidMessage, acknowledgment);

        verifyNoInteractions(notificationService);
        verifyNoInteractions(messagingTemplate);
        verifyNoInteractions(acknowledgment);
    }
}