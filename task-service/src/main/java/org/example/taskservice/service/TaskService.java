package org.example.taskservice.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.client.NotificationClient;
import org.example.taskservice.client.UserClient;
import org.example.taskservice.dto.Notifications;
import org.example.taskservice.dto.User;
import org.example.taskservice.exception.ResourceNotFoundException;
import org.example.taskservice.model.Task;
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
    private final NotificationClient notificationClient;
    private final UserClient userClient;

    public List<Task> getAllTasks() {
        log.info("Fetching all tasks");
        return taskRepository.findAll();
    }

    public List<Task> getTasksForUser(long userId) {
        log.info("Fetching tasks for user: {}", userId);
        return taskRepository.findByAssigneeId(userId);
    }

    public User getUserByTask(long taskId, String token) {
        Task task = getTaskById(taskId, token);
        log.info("Fetching user by task assigned to: {}", task.getAssigneeId());
        return userClient.getUserById(token, task.getAssigneeId());
    }

    public Task getTaskById(long taskId, String token) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    @Transactional
    public Task createTask(Task task, String token) {
        try {
            User user = userClient.getUserDetails(token);
            task.setAssigneeId(user.getId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Assignee not found");
        }
        Task savedTask = taskRepository.save(task);
        sendTaskNotification(savedTask, "New task assigned: " + savedTask.getTitle());
        return savedTask;
    }

    @Transactional
    public Task updateTask(Long taskId, Task taskDetails) {
        log.info("Updating task with ID: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setAssigneeId(taskDetails.getAssigneeId());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.setCompleted(taskDetails.isCompleted());

        sendTaskNotification(task, "Task updated: " + task.getTitle());

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteUserTasks(long userId) {
        log.info("Deleting user tasks for user: {}", userId);
        List<Task> tasks = taskRepository.findByAssigneeId(userId);
        taskRepository.deleteAll(tasks);
    }

    public void deleteTask(Long taskId) {
        log.info("Deleting task with ID: {}", taskId);
        Task task = getTaskById(taskId, null);
        sendTaskNotification(task, "Task deleted: " + task.getTitle());
        taskRepository.deleteById(taskId);
    }

    @CircuitBreaker(name = "notificationServiceCB", fallbackMethod = "notificationFallback")
    @Retry(name = "notificationRetry", fallbackMethod = "notificationFallback")
    public void sendTaskNotification(Task task, String message) {
        Notifications notification = createNotification(task, message);
        notificationClient.sendNotification(notification);
    }

    private Notifications createNotification(Task task, String message) {
        Notifications notification = new Notifications();
        notification.setMessage(message);
        notification.setRecipientId(task.getAssigneeId());
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        return notification;
    }

    public void notificationFallback(Task task, String message, Throwable t) {
        log.error("Notification service unavailable. Failed to send: {} for task: {}", message, task.getTitle(), t);
    }

    public List<Task> getOverdueTasks() {
        log.info("Fetching overdue tasks");
        return taskRepository.findByDueDateBeforeAndCompletedFalse(LocalDateTime.now());
    }
}
