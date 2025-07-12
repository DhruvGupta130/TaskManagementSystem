package org.example.notificationservice.service;

import org.example.notificationservice.dto.NotificationRequest;
import org.example.notificationservice.model.Notifications;
import org.example.notificationservice.repository.NotificationRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class NotificationServiceTest {

    private NotificationRepo notificationRepo;
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationRepo = mock(NotificationRepo.class);
        notificationService = new NotificationService(notificationRepo);
    }

    @Test
    void testSaveNotification_shouldCallRepoSave() {
        UUID userId = UUID.randomUUID();
        NotificationRequest request = new NotificationRequest("Test Message", userId, false);

        notificationService.saveNotification(request);

        ArgumentCaptor<Notifications> captor = ArgumentCaptor.forClass(Notifications.class);
        verify(notificationRepo).save(captor.capture());

        Notifications saved = captor.getValue();
        assertEquals(userId, saved.getRecipientId());
        assertEquals("Test Message", saved.getMessage());
        assertFalse(saved.isRead());
        assertNotNull(saved.getTimestamp());
    }

    @Test
    void testGetUsersNotifications_shouldCallFindAllByRecipientId() {
        UUID userId = UUID.randomUUID();
        notificationService.getUsersNotifications(userId);

        verify(notificationRepo).findAllByRecipientId(eq(userId), any(Sort.class));
    }

    @Test
    void testGetUnreadNotifications_shouldCallFindAllByRecipientIdAndRead() {
        UUID userId = UUID.randomUUID();
        notificationService.getUnreadNotifications(userId);

        verify(notificationRepo).findAllByRecipientIdAndRead(eq(userId), eq(false), any(Sort.class));
    }

    @Test
    void testReadNotifications_shouldMarkAllAsReadAndSave() {
        UUID userId = UUID.randomUUID();

        Notifications n1 = Notifications.builder()
                .id(1L)
                .recipientId(userId)
                .message("1")
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        Notifications n2 = Notifications.builder()
                .id(2L)
                .recipientId(userId)
                .message("2")
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        when(notificationRepo.findAllByRecipientIdAndRead(eq(userId), eq(false), any(Sort.class)))
                .thenReturn(List.of(n1, n2));

        notificationService.readNotifications(userId);

        assertTrue(n1.isRead());
        assertTrue(n2.isRead());

        verify(notificationRepo).saveAll(List.of(n1, n2));
    }
}