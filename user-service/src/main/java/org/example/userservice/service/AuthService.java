package org.example.userservice.service;

import lombok.AllArgsConstructor;
import org.example.userservice.configuration.JwtUtils;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.model.LoginUser;
import org.example.userservice.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public String registerUser(LoginUser user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists with username " + user.getUsername());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully";
    }

    public LoginResponse login(String username, String password) {
        LoginResponse response = new LoginResponse();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            updateLastLogin(username);

            response.setToken(jwtUtils.generateToken(userDetails));
            response.setMessage("Login successful");
            response.setStatus(HttpStatus.ACCEPTED.value());
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password");
        }
        return response;
    }

    public void updateUserPassword(String token, String newPassword) {
        var user = userRepo.findByUsername(getUserName(token))
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    private void updateLastLogin(String username) {
        LoginUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepo.save(user); // Only lastLogin gets updated
    }

    public String getUserName(String token) {
        if (token == null || !token.trim().toLowerCase().startsWith("bearer ")) {
            throw new IllegalArgumentException("Invalid or missing token");
        }
        String cleanedToken = token.trim().replace("Bearer ", "");
        return jwtUtils.parseToken(cleanedToken).getSubject();
    }

}
