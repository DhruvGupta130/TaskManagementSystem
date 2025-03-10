package org.example.taskservice.repository;

import org.example.taskservice.model.FailedNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FailedNotificationRepo extends JpaRepository<FailedNotification, Long> {
}