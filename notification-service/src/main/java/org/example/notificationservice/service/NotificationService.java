package org.example.notificationservice.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.model.Notifications;
import org.example.notificationservice.repository.NotificationRepo;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepository;

    public Notifications sendNotification(Notifications notification) {
        notification.setTimestamp(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notifications> getUsersNotifications(long userId) {
        return notificationRepository.findAllByRecipientId(
               userId, Sort.by(Sort.Order.desc("timestamp")));
    }

    public List<Notifications> getUnreadNotifications(long userId) {
        return notificationRepository.findAllByRecipientIdAndRead(
                userId, false,
                Sort.by(Sort.Order.desc("timestamp"))
        );
    }

    public void readNotifications(long userId) {
        List<Notifications> notifications = getUnreadNotifications(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public int deleteOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        int deletedCount = notificationRepository.deleteByTimestampBefore(thirtyDaysAgo);

        if (deletedCount > 0) {
            log.info("Deleted {} old notifications.", deletedCount);
        } else {
            log.info("No old notifications to delete.");
        }

        return deletedCount;
    }

}