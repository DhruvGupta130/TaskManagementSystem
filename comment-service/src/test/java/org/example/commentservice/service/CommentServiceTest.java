package org.example.commentservice.service;

import org.example.commentservice.dto.CommentRequest;
import org.example.commentservice.dto.CommentResponse;
import org.example.commentservice.dto.Response;
import org.example.commentservice.model.Comment;
import org.example.commentservice.repository.CommentRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CommentServiceTest {

    private CommentRepo commentRepo;
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        commentRepo = mock(CommentRepo.class);
        commentService = new CommentService(commentRepo);
    }

    @Test
    void testAddComment_shouldSaveCommentAndReturnResponse() {
        UUID userId = UUID.randomUUID();
        CommentRequest request = new CommentRequest(42L,"This is a comment");

        Response response = commentService.addComment(userId, request);

        ArgumentCaptor<Comment> captor = ArgumentCaptor.forClass(Comment.class);
        verify(commentRepo).save(captor.capture());

        Comment saved = captor.getValue();
        assertEquals(userId, saved.getUserId());
        assertEquals(request.content(), saved.getContent());
        assertEquals(request.taskId(), saved.getTaskId());

        assertEquals("Comment added successfully", response.message());
        assertEquals(201, response.status().value());
    }

    @Test
    void testGetCommentsByTaskId_shouldReturnMappedResponses() {
        Long taskId = 42L;

        Comment comment1 = Comment.builder()
                .id(1L)
                .userId(UUID.randomUUID())
                .content("First comment")
                .taskId(taskId)
                .build();

        Comment comment2 = Comment.builder()
                .id(2L)
                .userId(UUID.randomUUID())
                .content("Second comment")
                .taskId(taskId)
                .build();

        when(commentRepo.findByTaskId(taskId)).thenReturn(List.of(comment1, comment2));

        List<CommentResponse> responses = commentService.getCommentsByTaskId(taskId);

        assertEquals(2, responses.size());
        assertEquals("First comment", responses.get(0).content());
        assertEquals("Second comment", responses.get(1).content());

        verify(commentRepo).findByTaskId(taskId);
    }
}