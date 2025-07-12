package org.example.taskservice.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.taskservice.dto.Notifications;
import org.example.taskservice.kafka.NotificationProducer;
import org.example.taskservice.model.Task;
import org.example.taskservice.repository.TaskRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class TaskReminderScheduler {

    private final TaskRepo taskRepository;
    private final NotificationProducer notificationProducer;

    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminders() {
        log.info("Starting daily task reminders...");

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(task -> !task.isCompleted())
                .filter(task -> task.getDueDate() != null)
                .filter(task -> task.getDueDate().minusDays(1).isBefore(LocalDate.now()))
                .toList();
        tasks.forEach(task ->
                Thread.startVirtualThread(() -> safeSendDeadlineReminder(task))
        );
    }

    private void safeSendDeadlineReminder(Task task) {
        try {
            log.info("Sending reminder for task: {}", task.getTitle());
            notificationProducer.sendNotification(
                    new Notifications(
                            "Reminder: Task \"" + task.getTitle() + "\" is due tomorrow!",
                            task.getAssigneeId(),
                            false
                    )
            );
        } catch (Exception e) {
            log.error("Failed to send reminder for task: {} - {}", task.getTitle(), e.getMessage());
        }
    }

}
