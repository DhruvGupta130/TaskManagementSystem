package org.example.notificationservice.task;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class NotificationCleanupTask {

    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void cleanupOldNotifications() {
        log.info("Starting notification cleanup...");

        try {
            int deletedCount = notificationService.deleteOldNotifications();
            log.info("Cleanup complete. Deleted {} old notifications.", deletedCount);
        } catch (Exception e) {
            log.error("Error during notification cleanup: {}", e.getMessage(), e);
        }
    }
}