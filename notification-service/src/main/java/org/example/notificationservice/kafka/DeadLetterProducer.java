package org.example.notificationservice.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.NotificationRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeadLetterProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void send(String topic, @Valid NotificationRequest request) {
        try {
            String json = objectMapper.writeValueAsString(request);
            kafkaTemplate.send(topic, json);
            log.info("📤 Sent to DLT: {} -> {}", topic, json);
        } catch (Exception e) {
            log.error("❌ Failed to send to DLT: {}", e.getMessage(), e);
        }
    }
}