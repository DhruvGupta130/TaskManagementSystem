package com.example.authservice.util;

import com.example.authservice.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    @Value("${jwt.access-token.expiry}")
    private Duration accessTokenExpiry;

    @Value("${jwt.cookie.max-age}")
    private Duration refreshTokenExpiry;

    @Value("${jwt.token.issuer}")
    private String jwtIssuer;

    public String generateToken(String subject, UUID id, Role role) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(subject)
                .claim("id", id)
                .claim("authorities", List.of(role.name()))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plus(accessTokenExpiry))
                .issuer(jwtIssuer)
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public String generateRefreshToken(String subject, Role role) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(subject)
                .claim("authorities", List.of(role.name()))
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plus(refreshTokenExpiry))
                .issuer(jwtIssuer)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public boolean isValid(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            return jwt.getExpiresAt() != null && jwt.getExpiresAt().isAfter(Instant.now());
        } catch (JwtException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    public Optional<String> extractSubject(String token) {
        return Optional.ofNullable(jwtDecoder.decode(token).getSubject());
    }
}