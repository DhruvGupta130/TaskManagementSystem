package com.example.authservice.service;

import com.example.authservice.dto.Response;
import com.example.authservice.dto.UpdateUser;
import com.example.authservice.dto.UserInfo;
import com.example.authservice.enums.Role;
import com.example.authservice.model.LoginUser;
import com.example.authservice.repository.LoginUserRepo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final LoginUserRepo loginUserRepo;
    private final AuthService authService;

    @Cacheable(value = "userMapByIds", key = "#ids")
    public Map<UUID, UserInfo> findUsersById(Set<UUID> ids) {
        return loginUserRepo.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(LoginUser::getId, UserInfo::new));
    }

    @Cacheable(value = "userById", key = "#id")
    public UserInfo getUserProfileById(UUID id) {
        return loginUserRepo.findById(id)
                .map(UserInfo::new)
                .orElseThrow(() -> new RuntimeException("No user found with the id: "+ id));
    }

    @Cacheable(value = "userByEmail", key = "#email")
    public UserInfo getUserProfileByUsername(String email) {
        return loginUserRepo.findByEmail(email)
                .map(UserInfo::new)
                .orElseThrow(() -> new RuntimeException("No user found with the email: "+ email));
    }

    @Cacheable(value = "allWorkers")
    public List<UserInfo> getAllWorkers() {
        return loginUserRepo.findAllByRole(Role.WORKER)
                .stream()
                .map(UserInfo::new)
                .toList();
    }

    @Cacheable(value = "allManagers")
    public List<UserInfo> getAllManagers() {
        return loginUserRepo.findAllByRole(Role.MANAGER)
                .stream()
                .map(UserInfo::new)
                .toList();
    }

    public Response updateUser(UUID id, @Valid UpdateUser request) {
        return authService.updateUser(id, request);
    }
}
