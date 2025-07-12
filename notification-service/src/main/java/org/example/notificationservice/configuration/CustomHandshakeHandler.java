package org.example.notificationservice.configuration;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(@NonNull ServerHttpRequest request,
                                      @NonNull WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        Object auth = attributes.get("SPRING.AUTHENTICATION");
        if (auth instanceof Principal principal) {
            return principal;
        }
        return () -> "anonymous";
    }
}