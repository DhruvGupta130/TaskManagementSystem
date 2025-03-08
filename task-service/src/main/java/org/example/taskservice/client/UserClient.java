package org.example.taskservice.client;

import org.example.taskservice.dto.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/users/{userId}")
    User getUserById(@RequestHeader("Authorization") String token, @PathVariable long userId);

    @GetMapping("/api/users/me")
    User getUserDetails(@RequestHeader("Authorization") String token);
}
