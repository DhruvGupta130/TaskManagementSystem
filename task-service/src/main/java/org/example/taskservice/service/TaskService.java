package org.example.taskservice.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.taskservice.dto.*;
import org.example.taskservice.exception.ResourceNotFoundException;
import org.example.taskservice.kafka.NotificationProducer;
import org.example.taskservice.model.Task;
import org.example.taskservice.model.TaskExtension;
import org.example.taskservice.repository.TaskRepo;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepo taskRepo;
    private final UserService userService;
    private final NotificationProducer notificationProducer;

    private final Sort sort = Sort.by(Sort.Direction.DESC,"dueDate");

    @Cacheable(value = "allTasks")
    public List<TaskDetails> getAllTasks() {
        List<Task> tasks = taskRepo.findAll(sort);
        Map<UUID, User> userMap = getUserMapFromTasks(tasks);
        return tasks.stream()
                .map(task -> new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId())))
                .toList();
    }

    @Cacheable(value = "taskDetail", key = "'taskDetail::' + #userId + '-' + #taskId")
    public TaskDetails getTaskByUserId(UUID userId, long taskId) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> isUserAuthorized(t, userId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or access denied for ID: " + taskId));
        Map<UUID, User> userMap = userService.getUsersByIds(Set.of(task.getAssigneeId(), task.getManagerId()));
        return new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId()));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response createTask(UUID id, @Valid TaskRequest request) {
        Task savedTask = taskRepo.save(
                Task.builder()
                        .title(request.title())
                        .description(request.description())
                        .assigneeId(request.assigneeId())
                        .managerId(id)
                        .dueDate(request.dueDate())
                        .priority(request.priority())
                        .build()
        );
        notificationProducer.sendNotification(new Notifications(
                "New Task assigned: " + savedTask.getTitle(), savedTask.getAssigneeId(), false));
        return new Response("Task Created Successfully", HttpStatus.CREATED);
    }

    @Cacheable(value = "managerTasks", key = "#managerId")
    public List<TaskDetails> getTasksByManager(UUID managerId) {
        List<Task> tasks = taskRepo.findByManagerId(managerId);
        Map<UUID, User> userMap = getUserMapFromTasks(tasks);
        return tasks.stream()
                .map(task -> new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId())))
                .toList();
    }

    @Cacheable(value = "workerTasks", key = "#workerId")
    public List<TaskDetails> getTasksByWorker(UUID workerId) {
        List<Task> tasks = taskRepo.findByAssigneeId(workerId);
        Map<UUID, User> userMap = getUserMapFromTasks(tasks);
        return tasks.stream()
                .map(task -> new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId())))
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response updateTask(UUID managerId, Long taskId, @Valid TaskRequest request) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        if (task.isCompleted()) throw new IllegalStateException("Completed task cannot be updated.");
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setAssigneeId(request.assigneeId());
        task.setPriority(request.priority());
        taskRepo.save(task);
        notificationProducer.sendNotification(new Notifications(
                "Task details updated: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task Updated Successfully", HttpStatus.OK);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response deleteTask(UUID managerId, Long taskId) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        if (task.isCompleted()) throw new IllegalStateException("Completed tasks cannot be deleted.");
        taskRepo.delete(task);
        notificationProducer.sendNotification(new Notifications(
                "Task removed: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task Deleted Successfully", HttpStatus.OK);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response markTaskAsComplete(UUID workerId, Long taskId, CompletionRequest request) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getAssigneeId().equals(workerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        if (task.isCompleted()) throw new IllegalStateException("Completed tasks cannot be submitted.");
        task.setStatus(TaskStatus.SUBMITTED);
        task.setCompletionNote(request.notes());
        task.setSubmissionUrl(request.submissionUrl());
        taskRepo.save(task);
        return new Response("Task Submitted Successfully", HttpStatus.OK);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response requestExtension(UUID workerId, long taskId, @Valid ExtensionRequest request) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getAssigneeId().equals(workerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        if (task.isCompleted()) throw new IllegalStateException("This task is already completed.");
        if (!task.isOverDue()) throw new IllegalStateException("You can only request an extension for overdue tasks");
        if (task.getExtension() != null)
            throw new IllegalStateException("An extension request has already been made for this task");

        TaskExtension extension = TaskExtension.builder()
                .task(task)
                .requestedDueDate(request.requestedDueDate())
                .reason(request.reason())
                .build();
        task.setExtension(extension);
        taskRepo.save(task);
        return new Response("Task Requested Successfully", HttpStatus.OK);
    }

    @Cacheable(value = "extensionRequests", key = "#managerId")
    public List<TaskDetails> getAllExtensionRequest(UUID managerId) {
        List<Task> tasks = taskRepo.findAllByExtension_Status(ExtensionStatus.PENDING, sort)
                .stream()
                .filter(t -> t.getManagerId().equals(managerId))
                .toList();
        Map<UUID, User> userMap = getUserMapFromTasks(tasks);
        return tasks.stream()
                .map(task -> new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId())))
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response approveExtensionRequest(UUID managerId, Long taskId) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        TaskExtension extension = Optional.ofNullable(task.getExtension())
                .orElseThrow(() -> new ResourceNotFoundException("No extension request found."));
        if (extension.getStatus() == ExtensionStatus.APPROVED)
            throw new IllegalStateException("Already approved.");
        extension.setStatus(ExtensionStatus.APPROVED);
        task.setDueDate(extension.getRequestedDueDate());
        taskRepo.save(task);
        notificationProducer.sendNotification(new Notifications(
                "Task deadline Extension approved: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task extension approved successfully", HttpStatus.OK);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response rejectExtensionRequest(UUID managerId, Long taskId, String reason) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        TaskExtension extension = Optional.ofNullable(task.getExtension())
                .orElseThrow(() -> new ResourceNotFoundException("No extension request found."));
        if (extension.getStatus() != ExtensionStatus.PENDING)
            throw new IllegalStateException("Extension already processed.");
        extension.setStatus(ExtensionStatus.REJECTED);
        extension.setRejectReason(reason);
        taskRepo.save(task);
        notificationProducer.sendNotification(new Notifications(
                "Task deadline Extension rejected: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task extension rejected successfully", HttpStatus.OK);
    }

    @Cacheable(value = "submittedTasks", key = "#managerId")
    public List<TaskDetails> getAllSubmittedTasks(UUID managerId) {
        List<Task> tasks = taskRepo.findAllByStatus(TaskStatus.SUBMITTED, sort)
                .stream()
                .filter(t -> t.getManagerId().equals(managerId))
                .toList();
        Map<UUID, User> userMap = getUserMapFromTasks(tasks);
        return tasks.stream()
                .map(task -> new TaskDetails(task, userMap.get(task.getAssigneeId()), userMap.get(task.getManagerId())))
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response approveSubmittedTask(UUID managerId, Long taskId) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (task.getStatus() == TaskStatus.COMPLETED)
            throw new IllegalStateException("Already completed.");
        if (task.getStatus() != TaskStatus.SUBMITTED)
            throw new IllegalStateException("Not submitted yet.");
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        taskRepo.save(task);
        notificationProducer.sendNotification(new Notifications(
                "Task completion approved: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task approved successfully", HttpStatus.OK);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "allTasks", allEntries = true),
            @CacheEvict(value = "managerTasks", allEntries = true),
            @CacheEvict(value = "workerTasks", allEntries = true),
            @CacheEvict(value = "taskDetail", allEntries = true),
            @CacheEvict(value = "extensionRequests", allEntries = true),
            @CacheEvict(value = "submittedTasks", allEntries = true),
    })
    public Response rejectSubmittedTask(UUID managerId, Long taskId, String reason) {
        Task task = taskRepo.findById(taskId)
                .filter(t -> t.getManagerId().equals(managerId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (task.getStatus() != TaskStatus.SUBMITTED)
            throw new IllegalStateException("Only submitted tasks can be rejected.");
        task.setStatus(TaskStatus.REASSIGNED);
        task.setRejectionNote(reason);
        taskRepo.save(task);
        notificationProducer.sendNotification(new Notifications(
                "Task rejected and reassigned: " + task.getTitle(), task.getAssigneeId(), false));
        return new Response("Task rejected and reassigned: " + task.getTitle(), HttpStatus.OK);
    }

    private boolean isUserAuthorized(Task task, UUID userId) {
        return task.getAssigneeId().equals(userId) || task.getManagerId().equals(userId);
    }

    private Map<UUID, User> getUserMapFromTasks(List<Task> tasks) {
        if (tasks.isEmpty()) return Collections.emptyMap();
        Set<UUID> userIds = tasks.stream()
                .flatMap(t -> Stream.of(t.getAssigneeId(), t.getManagerId()))
                .collect(Collectors.toSet());
        return userService.getUsersByIds(userIds);
    }
}