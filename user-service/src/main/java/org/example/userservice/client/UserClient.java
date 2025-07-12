package org.example.userservice.client;

import org.example.userservice.configuration.FeignClientConfig;
import org.example.userservice.dto.UpdateUser;
import org.example.userservice.dto.UserInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@FeignClient(
        name = "auth-service",
        configuration = FeignClientConfig.class,
        path = "/api/internal/user"
)
public interface UserClient {

    @GetMapping("/username/{username}")
    UserInfo getUserByUsername(@PathVariable String username);

    @GetMapping("/id/{id}")
    UserInfo getUserById(@PathVariable UUID id);

    @GetMapping("/workers")
    List<UserInfo> findAllWorkers();

    @GetMapping("/managers")
    List<UserInfo> findAllManagers();

    @PutMapping("/update/{userId}")
    Map<String, ?> updateUser(@RequestBody UpdateUser request, @PathVariable UUID userId);
}
