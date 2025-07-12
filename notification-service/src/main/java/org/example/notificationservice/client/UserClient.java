package org.example.notificationservice.client;

import org.example.notificationservice.configuration.FeignClientConfig;
import org.example.notificationservice.dto.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "auth-service",
        configuration = FeignClientConfig.class,
        path = "/api/internal/user"
)
public interface UserClient {

    @GetMapping("/id/{userId}")
    User getUserById(@PathVariable("userId") UUID userId);
}