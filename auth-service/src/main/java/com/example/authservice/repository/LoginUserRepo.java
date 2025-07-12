package com.example.authservice.repository;

import com.example.authservice.dto.UserInfo;
import com.example.authservice.enums.Role;
import com.example.authservice.model.LoginUser;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LoginUserRepo extends JpaRepository<LoginUser, UUID> {
    Optional<LoginUser> findByEmail(@Email(message = "Invalid email format") String email);
    List<LoginUser> findAllByRole(Role role);
}
