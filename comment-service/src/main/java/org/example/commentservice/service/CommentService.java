package org.example.commentservice.service;

import lombok.AllArgsConstructor;
import org.example.commentservice.model.Comment;
import org.example.commentservice.repository.CommentRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CommentService {

    private final CommentRepo commentRepo;

    public Comment addComment(Comment comment) {
        return commentRepo.save(comment);
    }

    public List<Comment> getCommentsByTaskId(Long taskId) {
        return commentRepo.findByTaskId(taskId);
    }
}
