package org.example.taskservice.task;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.model.Task;
import org.example.taskservice.repository.TaskRepo;
import org.example.taskservice.service.TaskService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class TaskReminderScheduler {

    private final TaskRepo taskRepository;
    private final TaskService taskService;

    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminders() {
        log.info("Starting daily task reminders...");

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(task -> !task.isCompleted()) // Only incomplete tasks
                .filter(task -> task.getDueDate() != null)
                .filter(task -> task.getDueDate().minusDays(1).isBefore(LocalDateTime.now()))
                .toList();

        tasks.forEach(this::safeSendDeadlineReminder);
    }

    private void safeSendDeadlineReminder(Task task) {
        try {
            log.info("Sending reminder for task: {}", task.getTitle());
            taskService.sendTaskNotification(task, "Reminder: Task \"" + task.getTitle() + "\" is due tomorrow!");
        } catch (Exception e) {
            log.error("Failed to send reminder for task: {} - {}", task.getTitle(), e.getMessage());
        }
    }

    @Scheduled(fixedRate = 60000)
    public void updateOverdueTasks() {
        log.info("Checking for overdue tasks");
        List<Task> overdueTasks = taskRepository.findByDueDateBeforeAndCompletedFalse(LocalDateTime.now());
        for (Task task : overdueTasks) {
            if (!task.isOverdue()) {
                task.setOverdue(true);
                taskService.sendTaskNotification(task, "Task overdue: " + task.getTitle());
                taskRepository.save(task);
            }
        }
    }
}