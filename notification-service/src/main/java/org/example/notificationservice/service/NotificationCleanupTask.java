package org.example.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationCleanupTask {

    private final NotificationRepo notificationRepo;

    @Value("${notifications.retention-days:30}")
    private int retentionDays;

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupOldNotifications() {
        log.info("Starting notification cleanup...");
        try {
            int deletedCount = deleteOldNotifications();
            log.info("Cleanup complete. Deleted {} old notifications.", deletedCount);
        } catch (Exception e) {
            log.error("Error during notification cleanup: {}", e.getMessage(), e);
        }
    }

    private int deleteOldNotifications() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        int deletedCount = notificationRepo.deleteByTimestampBefore(cutoff);
        if (deletedCount > 0) {
            log.info("Deleted {} old notifications.", deletedCount);
        } else {
            log.info("No old notifications to delete.");
        }
        return deletedCount;
    }
}