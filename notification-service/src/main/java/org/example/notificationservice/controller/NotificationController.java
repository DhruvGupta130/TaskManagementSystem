package org.example.notificationservice.controller;

import lombok.AllArgsConstructor;
import org.example.notificationservice.model.Notifications;
import org.example.notificationservice.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notifications> sendNotification(@RequestBody Notifications notification) {
        return ResponseEntity.ok(notificationService.sendNotification(notification));
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<Notifications>> getNotifications(@PathVariable long userId) {
        return ResponseEntity.ok(notificationService.getUsersNotifications(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notifications>> getUnreadNotification(@PathVariable long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<Void> readNotifications(@PathVariable long userId) {
        notificationService.readNotifications(userId);
        return ResponseEntity.ok().build();
    }
}