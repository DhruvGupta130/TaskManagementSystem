package org.example.notificationservice.controller;

import lombok.AllArgsConstructor;
import org.example.notificationservice.model.Notifications;
import org.example.notificationservice.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notifications>> getAllNotifications(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(notificationService.getUsersNotifications(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notifications>> getUnreadNotifications(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(UUID.fromString(jwt.getClaimAsString("id"))));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<Void> markNotificationsAsRead(@AuthenticationPrincipal Jwt jwt) {
        notificationService.readNotifications(UUID.fromString(jwt.getClaimAsString("id")));
        return ResponseEntity.ok().build();
    }
}