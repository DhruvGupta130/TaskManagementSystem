package org.example.userservice.service;

import lombok.AllArgsConstructor;
import org.example.userservice.configuration.JwtUtils;
import org.example.userservice.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class Utility {

    private final JwtUtils jwtUtils;
    private final UserRepo userRepo;

    public boolean validateToken(String token) {
        token = token.replace("Bearer ", "");
        String username = jwtUtils.parseToken(token).getSubject();
        if(userRepo.findByUsername(username).isPresent()){
            return jwtUtils.isTokenActive(token);
        }
        return false;
    }
}
