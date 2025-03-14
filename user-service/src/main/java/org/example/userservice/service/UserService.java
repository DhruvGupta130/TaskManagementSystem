package org.example.userservice.service;

import lombok.AllArgsConstructor;
import org.example.userservice.client.TaskClient;
import org.example.userservice.dto.Task;
import org.example.userservice.dto.TaskAssignmentRequest;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.model.LoginUser;
import org.example.userservice.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepo userRepository;
    private final TaskClient taskClient;
    private final PasswordEncoder passwordEncoder;

    // Fetch user by username
    public UserDTO getUserByUsername(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return mapToUserDTO(user);
    }

    // Fetch user by ID
    public UserDTO getUserById(long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return mapToUserDTO(user);
    }

    // Fetch user with their tasks
    public List<?> getUserWithTasks(String username, String token) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        var tasks = taskClient.getTasksByUser(token);
        return List.of(user, tasks);
    }

    // Fetch all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToUserDTO).toList();
    }

    // Create new user
    public UserDTO createUser(LoginUser user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists with username: " + user.getUsername());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        var savedUser = userRepository.save(user);
        return mapToUserDTO(savedUser);
    }

    public UserDTO updateUser(long userId, LoginUser updatedUser) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));

        // Update only non-null fields
        if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
        if (updatedUser.getPassword() != null) user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));

        var savedUser = userRepository.save(user);
        return mapToUserDTO(savedUser);
    }

    // Delete user
    @Transactional
    public void deleteUser(long userId) {
        LoginUser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
        if(user.getRole().equals(LoginUser.Role.USER)){
            taskClient.deleteUserTasks(userId);
        } else if(user.getRole().equals(LoginUser.Role.MANAGER)) {
            taskClient.deleteManagerTasks(userId);
        }
        userRepository.deleteById(userId);
    }

    public List<UserDTO> getAllRegularUsers() {
        return userRepository.findByRole(LoginUser.Role.USER).stream().map(this::mapToUserDTO).toList();
    }

    // Delete regular user (only if role is USER)
    @Transactional
    public void deleteRegularUser(long userId) {
        validateRegularUser(userId);
        deleteUser(userId);
    }

    // Validation for regular users
    private void validateRegularUser(long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
        if (!user.getRole().equals(LoginUser.Role.USER)) {
            throw new RuntimeException("Operation not allowed for non-regular users.");
        }
    }

    // Map LoginUser entity to UserDTO
    private UserDTO mapToUserDTO(LoginUser user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getRole().name(), user.getName());
    }

    public Task assignTask(TaskAssignmentRequest request, String token) {
        return taskClient.assignTask(token, request);
    }

    public List<Task> getTasksByManager(String token) {
        return taskClient.getTasksByManager(token);
    }
}