package org.example.taskservice.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.client.UserClient;
import org.example.taskservice.dto.ExtensionRequestDto;
import org.example.taskservice.dto.User;
import org.example.taskservice.exception.ResourceNotFoundException;
import org.example.taskservice.model.Task;
import org.example.taskservice.model.TaskExtension;
import org.example.taskservice.repository.TaskRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepo taskRepository;
    private final UserClient userClient;
    private final NotificationService notificationService;

    public List<Task> getAllTasks(String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER") && !user.getRole().equals("ADMIN"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        log.info("Fetching all tasks");
        return taskRepository.findAll();
    }

    public List<Task> getTasksForUser(String  token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("USER"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        log.info("Fetching tasks for user: {}", user.getUsername());
        return taskRepository.findByAssigneeId(user.getId());
    }

    public User getUserByTask(long taskId, String token) {
        Task task = getTaskById(taskId, token);
        log.info("Fetching user by task assigned to: {}", task.getAssigneeId());
        return userClient.getUserById(token, task.getAssigneeId());
    }

    public Task getTaskById(long taskId, String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER") && !user.getRole().equals("ADMIN"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    @Transactional
    public Task createTask(Task task, String token) {
        try {
            User user = userClient.getUserDetails(token);
            if (user == null || (!user.getRole().equals("MANAGER") && !user.getRole().equals("ADMIN"))) {
                throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
            }
            task.setAssigneeId(user.getId());
            task.setLastUpdated(LocalDateTime.now());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Assignee not found");
        }
        Task savedTask = taskRepository.save(task);
        notificationService.sendTaskNotification(savedTask, "New task assigned: " + savedTask.getTitle());
        return savedTask;
    }

    @Transactional
    public Task assignTask(Task task, String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER") && !user.getRole().equals("ADMIN"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        task.setLastUpdated(LocalDateTime.now());
        notificationService.sendTaskNotification(task, "New task assigned: " + task.getTitle());
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long taskId, Task taskDetails, String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER") && !user.getRole().equals("ADMIN"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        log.info("Updating task with ID: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setAssigneeId(taskDetails.getAssigneeId());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.setLastUpdated(LocalDateTime.now());
        task.setCompleted(taskDetails.isCompleted());

        notificationService.sendTaskNotification(task, "Task updated: " + task.getTitle());

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(long taskId, Task taskDetails, String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("USER"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        log.info("Updating task status with ID: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        task.setCompleted(taskDetails.isCompleted());
        task.setLastUpdated(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteUserTasks(long userId) {
        log.info("Deleting user tasks for user: {}", userId);
        List<Task> tasks = taskRepository.findByAssigneeId(userId);
        taskRepository.deleteAll(tasks);
    }

    @Transactional
    public void deleteManagerTasks(long userId) {
        log.info("Deleting manager tasks for user: {}", userId);
        List<Task> tasks = taskRepository.findByManagerId(userId);
        taskRepository.deleteAll(tasks);
    }

    public void deleteTask(Long taskId, String token) {
        Task task = getTaskById(taskId, token);
        log.info("Deleting task with ID: {}", taskId);
        notificationService.sendTaskNotification(task, "Task deleted: " + task.getTitle());
        taskRepository.deleteById(taskId);
    }

    public List<Task> getTasksByManager(String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        return taskRepository.findByManagerId(user.getId());
    }

    public List<Task> getOverdueTasks(String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!user.getRole().equals("MANAGER"))) {
            throw new ResourceNotFoundException("Unauthorized, You are not authorized to perform this operation");
        }
        log.info("Fetching overdue tasks");
        return taskRepository.findByDueDateBeforeAndCompletedAndManagerId(LocalDateTime.now(), false, user.getId());
    }

    public Task requestExtension(long taskId, ExtensionRequestDto request, String token) {
        User user = userClient.getUserDetails(token);
        if (user == null || (!"USER".equals(user.getRole()))) {
            throw new ResourceNotFoundException("Unauthorized: You are not authorized to perform this operation");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (!task.isOverdue()) {
            throw new IllegalStateException("You can only request an extension for overdue tasks");
        }

        if (task.getExtension() != null) {
            throw new IllegalStateException("An extension request has already been made for this task");
        }

        TaskExtension extension = new TaskExtension();
        extension.setTask(task);
        extension.setRequestedDueDate(request.getRequestedDueDate());
        extension.setReason(request.getReason());

        task.setExtension(extension);
        return taskRepository.save(task);
    }

}
