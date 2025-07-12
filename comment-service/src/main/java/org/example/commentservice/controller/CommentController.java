package org.example.commentservice.controller;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import org.example.commentservice.dto.CommentResponse;
import org.example.commentservice.dto.Response;
import org.example.commentservice.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{taskId}")
    public ResponseEntity<Response> addComment(
            @AuthenticationPrincipal Jwt jwt,
            @NotBlank(message = "Comment cannot be blank") @RequestBody String comment,
            @PathVariable Long taskId) {
        return ResponseEntity
                .ok(commentService.addComment(UUID.fromString(jwt.getClaimAsString("id")), comment, taskId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<List<CommentResponse>> getComments(@AuthenticationPrincipal Jwt jwt,
            @PathVariable Long taskId) {
        return ResponseEntity
                .ok(commentService.getCommentsByTaskId(taskId, UUID.fromString(jwt.getClaimAsString("id"))));
    }
}
