package org.example.taskservice.client;

import org.example.taskservice.configuration.FeignClientConfig;
import org.example.taskservice.dto.Notifications;
import org.example.taskservice.dto.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", configuration = FeignClientConfig.class)
public interface NotificationClient {

    @PostMapping("/api/notifications")
    Response sendNotification(@RequestBody Notifications notification);

}