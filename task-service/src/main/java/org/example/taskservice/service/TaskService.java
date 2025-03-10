package org.example.taskservice.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.client.UserClient;
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
    private final UserClient userClient;
    private final NotificationService notificationService;

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
            task.setLastUpdated(LocalDateTime.now());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Assignee not found");
        }
        Task savedTask = taskRepository.save(task);
        notificationService.sendTaskNotification(savedTask, "New task assigned: " + savedTask.getTitle());
        return savedTask;
    }

    @Transactional
    public Task assignTask(Task task) {
        task.setLastUpdated(LocalDateTime.now());
        notificationService.sendTaskNotification(task, "New task assigned: " + task.getTitle());
        return taskRepository.save(task);
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
        task.setLastUpdated(LocalDateTime.now());
        task.setCompleted(taskDetails.isCompleted());

        notificationService.sendTaskNotification(task, "Task updated: " + task.getTitle());

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
        notificationService.sendTaskNotification(task, "Task deleted: " + task.getTitle());
        taskRepository.deleteById(taskId);
    }

    public List<Task> getTasksByManager(Long managerId) {
        return taskRepository.findByManagerId(managerId);
    }

    public List<Task> getOverdueTasks() {
        log.info("Fetching overdue tasks");
        return taskRepository.findByDueDateBeforeAndCompletedFalse(LocalDateTime.now());
    }

}
