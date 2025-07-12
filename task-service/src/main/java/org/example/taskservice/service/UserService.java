package org.example.taskservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.client.UserClient;
import org.example.taskservice.dto.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final UserClient userClient;

    @CircuitBreaker(name = "userServiceCB", fallbackMethod = "getFallbackUsers")
    @Retry(name = "userServiceRetry", fallbackMethod = "getFallbackUsers")
    @RateLimiter(name = "userServiceRateLimiter", fallbackMethod = "getFallbackUsers")
    public Map<UUID, User> getUsersByIds(Set<UUID> ids) {
        return userClient.getUsersByIds(ids);
    }

    @SuppressWarnings("unused")
    public Map<UUID, User> getFallbackUsers(Set<UUID> ids, Throwable t) {
        log.warn("🛑 [Fallback Triggered] User service unavailable for {} users. Reason: {}", ids.size(), t.getMessage());
        return Collections.emptyMap();
    }

}
