package com.example.authservice.service;

import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.Response;
import com.example.authservice.dto.SignupRequest;
import com.example.authservice.dto.UpdateUser;
import com.example.authservice.model.LoginUser;
import com.example.authservice.repository.LoginUserRepo;
import com.example.authservice.util.JwtCookieProperties;
import com.example.authservice.util.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final LoginUserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtCookieProperties jwtCookieProperties;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginUserRepo loginUserRepo;

    @Caching(evict = {
            @CacheEvict(value = "userById", allEntries = true),
            @CacheEvict(value = "userMapByIds", allEntries = true),
            @CacheEvict(value = "userByEmail", allEntries = true),
            @CacheEvict(value = "allWorkers", allEntries = true),
            @CacheEvict(value = "allManagers", allEntries = true)
    })
    public Response signup(@Valid SignupRequest request) {
        if (userRepo.findByEmail(request.email()).isPresent()) throw new RuntimeException("Email already in use");
        LoginUser user = LoginUser.builder()
                .email(request.email())
                .name(request.name())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();
        userRepo.save(user);
        return new Response("User registered successfully", HttpStatus.CREATED, Map.of());
    }

    public Response login(@Valid LoginRequest request, HttpServletResponse servletResponse) {
        LoginUser user = loginUserRepo.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Bad credentials"));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.password())
        );
        String accessToken = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), user.getRole());
        ResponseCookie jwtCookie = ResponseCookie.from(jwtCookieProperties.getName(), refreshToken)
                .httpOnly(jwtCookieProperties.isHttpOnly())
                .secure(jwtCookieProperties.isSecure())
                .sameSite(jwtCookieProperties.getSameSite())
                .path(jwtCookieProperties.getPath())
                .maxAge(jwtCookieProperties.getMaxAge())
                .build();
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        return new Response("Login successful", HttpStatus.OK,
                Map.of(
                        "accessToken", accessToken,
                        "role", user.getRole()
                )
        );
    }

    public Response refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) throw new RuntimeException("Refresh token missing");
        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> jwtCookieProperties.getName().equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(jwtService::isValid)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Refresh token missing"));
        String email = jwtService.extractSubject(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        return userRepo.findByEmail(email)
                .map(user -> {
                    String newAccessToken = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());
                    return new Response("Access token refreshed", HttpStatus.OK,
                            Map.of(
                                    "accessToken", newAccessToken,
                                    "role", user.getRole()
                            )
                    );
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Response logout(HttpServletResponse response) {
        Cookie clearCookie = new Cookie(jwtCookieProperties.getName(), "");
        clearCookie.setHttpOnly(jwtCookieProperties.isHttpOnly());
        clearCookie.setSecure(jwtCookieProperties.isSecure());
        clearCookie.setPath(jwtCookieProperties.getPath());
        clearCookie.setMaxAge(0);
        clearCookie.setAttribute("SameSite", jwtCookieProperties.getSameSite());

        response.addCookie(clearCookie);
        return new Response("Logout successful", HttpStatus.OK, Map.of());
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "userById", allEntries = true),
            @CacheEvict(value = "userMapByIds", allEntries = true),
            @CacheEvict(value = "userByEmail", allEntries = true),
            @CacheEvict(value = "allWorkers", allEntries = true),
            @CacheEvict(value = "allManagers", allEntries = true)
    })
    public Response updateUser(UUID userId, @Valid UpdateUser request) {
        LoginUser user = loginUserRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        loginUserRepo.save(user);
        return new Response("Profile Updated Successfully", HttpStatus.OK, Map.of());
    }
}