package org.example.commentservice.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.example.commentservice.dto.CommentRequest;
import org.example.commentservice.dto.CommentResponse;
import org.example.commentservice.dto.Response;
import org.example.commentservice.model.Comment;
import org.example.commentservice.repository.CommentRepo;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepo commentRepo;

    @CacheEvict(value = "taskComments", key = "#taskId")
    public Response addComment(UUID userId, @NotBlank(message = "Comment cannot be blank") String comment,
            Long taskId) {
        commentRepo.save(
                Comment.builder()
                        .userId(userId)
                        .content(comment)
                        .taskId(taskId)
                        .build());
        return new Response("Comment added successfully", HttpStatus.CREATED);
    }

    @Cacheable(value = "taskComments", key = "#taskId")
    public List<CommentResponse> getCommentsByTaskId(Long taskId, UUID userId) {
        return commentRepo.findByTaskId(taskId)
                .stream()
                .map(comment -> new CommentResponse(comment, userId))
                .toList();
    }
}
