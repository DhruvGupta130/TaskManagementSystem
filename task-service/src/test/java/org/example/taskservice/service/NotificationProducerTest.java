package org.example.taskservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.taskservice.dto.Notifications;
import org.example.taskservice.kafka.NotificationProducer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.UUID;

import static org.mockito.Mockito.*;

class NotificationProducerTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private NotificationProducer notificationProducer;

    private final UUID recipientId = UUID.randomUUID();
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
    void shouldSendNotificationToKafka() throws Exception {
        // Arrange
        Notifications notification = new Notifications("Test Message", recipientId, false);
        String jsonMessage = "{\"message\":\"Test Message\",\"recipientId\":\"" + recipientId + "\",\"read\":false}";
        when(objectMapper.writeValueAsString(notification)).thenReturn(jsonMessage);

        // Act (test the internal sync method directly)
        notificationProducer.sendNotification(notification); // uses virtual thread internally

        // Wait briefly to ensure async task completes (not ideal, but sufficient for unit test)
        Thread.sleep(100); // keep this small and only in test

        // Assert
        verify(objectMapper).writeValueAsString(notification);
        verify(kafkaTemplate).send("notifications", recipientId.toString(), jsonMessage);
    }

    @Test
    void shouldLogErrorWhenSerializationFails() throws Exception {
        // Arrange
        Notifications notification = new Notifications("Failing", recipientId, false);
        when(objectMapper.writeValueAsString(notification)).thenThrow(new RuntimeException("Serialization error"));

        // Act
        notificationProducer.sendNotification(notification); // still calls sync under virtual thread

        // Wait to let async task complete
        Thread.sleep(100);

        // Assert
        verify(objectMapper).writeValueAsString(notification);
        verify(kafkaTemplate, never()).send(any(), any(), any());
    }
}