package org.example.notificationservice.repository;

import org.example.notificationservice.model.Notifications;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepo extends JpaRepository<Notifications, Long> {

    @Modifying
    @Query("DELETE FROM Notifications n WHERE n.timestamp < :cutoff")
    int deleteByTimestampBefore(@Param("cutoff") LocalDateTime cutoff);

    List<Notifications> findAllByRecipientId(UUID recipientId, Sort sort);
    List<Notifications> findAllByRecipientIdAndRead(UUID recipientId, boolean read, Sort sort);
}
