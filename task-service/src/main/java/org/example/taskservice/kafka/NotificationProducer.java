package org.example.taskservice.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.dto.Notifications;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendNotification(Notifications notification) {
        Thread.startVirtualThread(() -> sendSync(notification));
    }

    private void sendSync(Notifications notification) {
        try {
            String message = objectMapper.writeValueAsString(notification);
            kafkaTemplate.send("notifications", notification.recipientId().toString(), message);
            log.info("📤 Published notification to Kafka for user: {}", notification.recipientId());
        } catch (Exception e) {
            log.error("❌ Failed to publish Kafka message", e);
        }
    }
}

