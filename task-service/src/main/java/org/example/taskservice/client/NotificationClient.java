package org.example.taskservice.client;

import org.example.taskservice.dto.Notifications;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications")
    Notifications sendNotification(@RequestBody Notifications notification);

}