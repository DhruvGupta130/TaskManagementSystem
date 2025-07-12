package com.example.authservice.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt.cookie")
public class JwtCookieProperties {
    private String name;
    private boolean secure;
    private boolean httpOnly;
    private String sameSite;
    private String path;
    private Duration maxAge;
}