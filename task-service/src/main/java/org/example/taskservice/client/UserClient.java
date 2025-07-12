package org.example.taskservice.client;

import org.example.taskservice.configuration.FeignClientConfig;
import org.example.taskservice.dto.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@FeignClient(name = "auth-service", configuration = FeignClientConfig.class)
public interface UserClient {

    @GetMapping("/api/internal/user/id/{userId}")
    User getUserById(@PathVariable UUID userId);

    @PostMapping("/api/internal/user/users")
    Map<UUID, User> getUsersByIds(@RequestBody Set<UUID> ids);
}
