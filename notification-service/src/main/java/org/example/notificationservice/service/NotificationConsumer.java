package org.example.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.NotificationRequest;
import org.example.notificationservice.dto.User;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final DeadLetterProducer deadLetterProducer;

    @KafkaListener(topics = "notifications", groupId = "notification-group")
    public void consumeNotification(String message, Acknowledgment ack) {
        try {
            NotificationRequest notification = objectMapper.readValue(message, NotificationRequest.class);
            log.info("📥 Kafka message received for user: {}", notification.recipientId());
            notificationService.saveNotification(notification);
            log.info("✅ Notification saved successfully for user: {}", notification.recipientId());
            User user = userService.getUserById(notification.recipientId());
            System.out.println(user);
            if (user == null) {
                deadLetterProducer.send("notifications.DLT", notification);
                ack.acknowledge();
                log.warn("⚠️ Could not fetch user info (fallback/null) for ID: {}. Skipping WebSocket delivery.",
                        notification.recipientId());
                return;
            }
            messagingTemplate.convertAndSendToUser(
                    user.email(),
                    "/queue/notifications",
                    notification);
            ack.acknowledge();
            log.info("📤 Real-time notification sent to user: {}", user.email());
        } catch (Exception e) {
            log.error("❌ Failed to process Kafka message: {}", message, e);
        }
    }

}