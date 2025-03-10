package org.example.taskservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.client.NotificationClient;
import org.example.taskservice.dto.Notifications;
import org.example.taskservice.model.FailedNotification;
import org.example.taskservice.model.Task;
import org.example.taskservice.repository.FailedNotificationRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@Slf4j
public class NotificationService {

    private final FailedNotificationRepo failedNotificationRepo;
    private final NotificationClient notificationClient;

    private Notifications createNotification(Task task, String message) {
        Notifications notification = new Notifications();
        notification.setMessage(message);
        notification.setRecipientId(task.getAssigneeId());
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        return notification;
    }

    @CircuitBreaker(name = "notificationServiceCB", fallbackMethod = "notificationServiceFallback")
    @Retry(name = "notificationRetry", fallbackMethod = "notificationServiceFallback")
    @RateLimiter(name = "notificationRateLimiter", fallbackMethod = "notificationServiceFallback")
    public void sendTaskNotification(Task task, String message) {
        Notifications notification = createNotification(task, message);
        notificationClient.sendNotification(notification);
    }

    public void notificationServiceFallback(Task task, String message, Throwable t) {
        log.warn("Notification service unavailable. Failed to send: {} for task: {}. Error: {}", message, task.getTitle(), t.getMessage());
        FailedNotification failedNotification = new FailedNotification();
        failedNotification.setRecipientId(task.getAssigneeId());
        failedNotification.setMessage(message);
        failedNotificationRepo.save(failedNotification);
    }
}
