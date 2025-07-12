package org.example.apigateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                // Task Service
                .route("task-service", r -> r
                        .path("/api/tasks/**")
                        .uri("lb://task-service"))

                // User Service
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .uri("lb://user-service"))

                // Auth (part of User Service)
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://auth-service"))

                // Notification Service
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .uri("lb://notification-service"))

                // Comment Service
                .route("comment-service", r -> r
                        .path("/api/comments/**")
                        .uri("lb://comment-service"))

                .route("notification_ws", r -> r
                        .path("/ws/notification/**")
                        .uri("lb://notification-service"))

                .build();
    }
}
