package org.example.notificationservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.notificationservice.client.UserClient;
import org.example.notificationservice.dto.User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserClient userClient;

    @CircuitBreaker(name = "userServiceCB", fallbackMethod = "getFallbackUser")
    @Retry(name = "userServiceRetry", fallbackMethod = "getFallbackUser")
    @RateLimiter(name = "userServiceRateLimiter", fallbackMethod = "getFallbackUser")
    public User getUserById(UUID id) {
        log.info("🔍 Fetching user with ID: {}", id);
        return userClient.getUserById(id);
    }

    @SuppressWarnings("unused")
    public User getFallbackUser(UUID id, Throwable t) {
        log.error("🛑 Fallback triggered for userId {} due to {}", id, t.toString());
        return null;
    }
}
