package com.example.authservice.service;

import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.Response;
import com.example.authservice.dto.SignupRequest;
import com.example.authservice.enums.Role;
import com.example.authservice.model.LoginUser;
import com.example.authservice.repository.LoginUserRepo;
import com.example.authservice.util.JwtCookieProperties;
import com.example.authservice.util.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    private LoginUserRepo loginUserRepo;
    private PasswordEncoder passwordEncoder;
    private JwtCookieProperties jwtCookieProperties;
    private JwtService jwtService;
    private AuthenticationManager authenticationManager;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        loginUserRepo = mock(LoginUserRepo.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtCookieProperties = mock(JwtCookieProperties.class);
        jwtService = mock(JwtService.class);
        authenticationManager = mock(AuthenticationManager.class);

        authService = new AuthService(
                loginUserRepo,
                passwordEncoder,
                jwtCookieProperties,
                jwtService,
                authenticationManager,
                loginUserRepo
        );
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("user@example.com", "password");
        LoginUser user = new LoginUser();
        user.setId(UUID.randomUUID());
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");
        user.setRole(Role.WORKER);

        HttpServletResponse servletResponse = mock(HttpServletResponse.class);

        when(loginUserRepo.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtService.generateToken(user.getEmail(), user.getId(), user.getRole())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(user.getEmail(), user.getRole())).thenReturn("refresh-token");

        when(jwtCookieProperties.getName()).thenReturn("refreshToken");
        when(jwtCookieProperties.isHttpOnly()).thenReturn(true);
        when(jwtCookieProperties.isSecure()).thenReturn(false);
        when(jwtCookieProperties.getSameSite()).thenReturn("Lax");
        when(jwtCookieProperties.getPath()).thenReturn("/");
        when(jwtCookieProperties.getMaxAge()).thenReturn(Duration.ofSeconds(3600));

        Response response = authService.login(request, servletResponse);

        assertEquals("Login successful", response.message());
        assertEquals("access-token", response.data().get("accessToken"));
        verify(servletResponse).addHeader(eq("Set-Cookie"), anyString());
    }

    @Test
    void testLoginWithWrongEmail() {
        LoginRequest request = new LoginRequest("invalid@example.com", "password");
        when(loginUserRepo.findByEmail("invalid@example.com")).thenReturn(Optional.empty());

        HttpServletResponse response = mock(HttpServletResponse.class);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request, response));

        assertEquals("Bad credentials", exception.getMessage());
    }

    @Test
    void testSignupSuccess() {
        SignupRequest request = new SignupRequest("john@example.com","John Doe", Role.WORKER, "password123");

        when(loginUserRepo.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        Response response = authService.signup(request);

        assertEquals("User registered successfully", response.message());
        assertEquals(HttpStatus.CREATED, response.status());
        verify(loginUserRepo).save(any(LoginUser.class));
    }

    @Test
    void testSignupWithExistingEmail() {
        SignupRequest request = new SignupRequest("john@example.com","John Doe", Role.WORKER, "password123");
        when(loginUserRepo.findByEmail("john@example.com")).thenReturn(Optional.of(new LoginUser()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.signup(request));

        assertEquals("Email already in use", exception.getMessage());
        verify(loginUserRepo, never()).save(any(LoginUser.class));
    }

}