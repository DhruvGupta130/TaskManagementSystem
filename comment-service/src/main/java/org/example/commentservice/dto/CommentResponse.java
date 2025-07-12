package org.example.commentservice.dto;

import org.example.commentservice.model.Comment;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
        Long id,
        boolean isMe,
        String content,
        LocalDateTime createdAt) implements Serializable {
    public CommentResponse(Comment comment, UUID currentUserId) {
        this(
                comment.getId(),
                comment.getUserId().equals(currentUserId),
                comment.getContent(),
                comment.getTimestamp());
    }
}
