package org.example.taskservice.service;

import org.example.taskservice.dto.*;
import org.example.taskservice.exception.ResourceNotFoundException;
import org.example.taskservice.kafka.NotificationProducer;
import org.example.taskservice.model.*;
import org.example.taskservice.repository.TaskRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TaskServiceTest {

    @Mock private TaskRepo taskRepo;
    @Mock private UserService userService;
    @Mock private NotificationProducer notificationProducer;

    @InjectMocks private TaskService taskService;

    private AutoCloseable closeable;

    private final UUID managerId = UUID.randomUUID();
    private final UUID workerId = UUID.randomUUID();
    private final Long taskId = 1L;

    @BeforeEach
    void setup() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void shouldCreateTaskSuccessfully() {
        TaskRequest request = new TaskRequest("Title", "Description", workerId, Priority.MEDIUM, LocalDate.now().plusDays(2));
        Task task = Task.builder().title("Title").assigneeId(workerId).managerId(managerId).build();

        when(taskRepo.save(any(Task.class))).thenReturn(task);

        Response response = taskService.createTask(managerId, request);

        assertThat(response.message()).isEqualTo("Task Created Successfully");
        assertThat(response.status()).isEqualTo(HttpStatus.CREATED);
        verify(notificationProducer).sendNotification(any(Notifications.class));
    }

    @Test
    void shouldGetAllTasks() {
        Task task = Task.builder()
                .id(taskId)
                .assigneeId(workerId)
                .managerId(managerId)
                .status(TaskStatus.ASSIGNED)
                .build();
        when(taskRepo.findAll()).thenReturn(List.of(task));
        when(userService.getUsersByIds(anySet())).thenReturn(Map.of(workerId, dummyUser(), managerId, dummyUser()));

        List<TaskDetails> result = taskService.getAllTasks();

        assertThat(result).hasSize(1);
        verify(taskRepo).findAll();
    }

    @Test
    void shouldGetTaskByUserId() {
        Task task = Task.builder()
                .id(taskId)
                .assigneeId(workerId)
                .managerId(managerId)
                .status(TaskStatus.ASSIGNED)
                .build();
        when(taskRepo.findById(taskId)).thenReturn(Optional.of(task));
        when(userService.getUsersByIds(anySet())).thenReturn(Map.of(workerId, dummyUser(), managerId, dummyUser()));

        TaskDetails result = taskService.getTaskByUserId(workerId, taskId);

        assertThat(result.id()).isEqualTo(taskId);
    }

    @Test
    void shouldThrowWhenUserNotAuthorized() {
        Task task = Task.builder().id(taskId).assigneeId(UUID.randomUUID()).managerId(UUID.randomUUID()).build();
        when(taskRepo.findById(taskId)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> taskService.getTaskByUserId(workerId, taskId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldApproveTaskSubmission() {
        Task task = Task.builder().id(taskId).managerId(managerId).assigneeId(workerId).status(TaskStatus.SUBMITTED).build();
        when(taskRepo.findById(taskId)).thenReturn(Optional.of(task));

        Response response = taskService.approveSubmittedTask(managerId, taskId);

        assertThat(response.message()).isEqualTo("Task approved successfully");
        verify(taskRepo).save(any(Task.class));
        verify(notificationProducer).sendNotification(any(Notifications.class));
    }

    @Test
    void shouldRejectSubmittedTask() {
        Task task = Task.builder().id(taskId).managerId(managerId).assigneeId(workerId).status(TaskStatus.SUBMITTED).build();
        when(taskRepo.findById(taskId)).thenReturn(Optional.of(task));

        Response response = taskService.rejectSubmittedTask(managerId, taskId, "Incomplete");

        assertThat(response.message()).contains("Task rejected");
        verify(taskRepo).save(any(Task.class));
        verify(notificationProducer).sendNotification(any(Notifications.class));
    }

    @Test
    void shouldRequestExtension() {
        Task task = Task.builder().id(taskId).assigneeId(workerId).status(TaskStatus.ASSIGNED)
                .dueDate(LocalDate.now().minusDays(1)).build();

        when(taskRepo.findById(taskId)).thenReturn(Optional.of(task));

        ExtensionRequest request = new ExtensionRequest("Need more time", LocalDate.now().plusDays(2));
        Response response = taskService.requestExtension(workerId, taskId, request);

        assertThat(response.message()).isEqualTo("Task Requested Successfully");
        verify(taskRepo).save(any(Task.class));
    }

    private User dummyUser() {
        return new User(UUID.randomUUID(), "test@example.com", "Test User", Role.WORKER);
    }
}
