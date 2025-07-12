package org.example.notificationservice.service;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.dto.NotificationRequest;
import org.example.notificationservice.model.Notifications;
import org.example.notificationservice.repository.NotificationRepo;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepository;

    public void saveNotification(@Valid NotificationRequest request) {
        notificationRepository.save(
                Notifications.builder()
                        .recipientId(request.recipientId())
                        .read(request.read())
                        .message(request.message())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    public List<Notifications> getUsersNotifications(UUID userId) {
        return notificationRepository.findAllByRecipientId(
               userId, Sort.by(Sort.Order.desc("timestamp")));
    }

    public List<Notifications> getUnreadNotifications(UUID userId) {
        return notificationRepository.findAllByRecipientIdAndRead(
                userId, false,
                Sort.by(Sort.Order.desc("timestamp"))
        );
    }

    public void readNotifications(UUID userId) {
        List<Notifications> notifications = getUnreadNotifications(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

}