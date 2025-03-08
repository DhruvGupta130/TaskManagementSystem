package org.example.userservice.repository;

import org.example.userservice.model.LoginUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<LoginUser, Long> {

    Optional<LoginUser> findByUsername(String username);
    List<LoginUser> findByRole(LoginUser.Role role);
}
