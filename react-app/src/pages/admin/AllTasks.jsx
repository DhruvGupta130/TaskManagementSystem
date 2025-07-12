import { useEffect, useState } from 'react';
import {
    Container, Typography, Grid, Paper, Box, IconButton, Tooltip,
    CircularProgress, Chip, Link, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, InputAdornment
} from '@mui/material';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import api from '../../api/api';

const getStatusColor = (status) => ({
    COMPLETED: 'success',
    PENDING: 'warning',
    REJECTED: 'error',
    ASSIGNED: 'info'
})[status] || 'default';

const getPriorityColor = (priority) => ({
    HIGH: 'error',
    MEDIUM: 'warning',
    LOW: 'success'
})[priority] || 'default';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentOpen, setCommentOpen] = useState(false);
    const [commentTaskId, setCommentTaskId] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/tasks/admin/tasks");
                setTasks(res.data || []);
            } catch (err) {
                enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleOpenComments = async (taskId) => {
        setCommentTaskId(taskId);
        setCommentOpen(true);
        try {
            const res = await api.get(`/comments/${taskId}`);
            setComments(res.data);
        } catch {
            enqueueSnackbar("Failed to load comments", { variant: "error" });
        }
    };

    const sendComment = async () => {
        if (!commentInput.trim()) return;
        setCommentLoading(true);
        try {
            await api.post(`/comments/${commentTaskId}`, commentInput, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setComments(prev => [...prev, {
                id: Date.now(),
                isMe: true,
                content: commentInput,
                createdAt: new Date().toISOString()
            }]);
            setCommentInput('');
        } catch {
            enqueueSnackbar("Failed to send comment", { variant: "error" });
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                My Assigned Tasks
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : tasks.length === 0 ? (
                <Typography variant="body1" color="text.secondary" mt={3}>
                    You haven't assigned any tasks yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box width="100%">
                                        <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                                            Assigned to: <strong>{task.assignee?.name}</strong> ({task.assignee?.email})
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                                            {task.description?.length > 80
                                                ? `${task.description.slice(0, 80)}...`
                                                : task.description}
                                        </Typography>

                                        {task.dueDate && (
                                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                                Deadline: {dayjs(task.dueDate).format('DD MMM YYYY')}
                                            </Typography>
                                        )}

                                        <Box mt={1}>
                                            {task.priority && (
                                                <Chip
                                                    label={`Priority: ${task.priority}`}
                                                    size="small"
                                                    color={getPriorityColor(task.priority)}
                                                    sx={{ mr: 1 }}
                                                />
                                            )}
                                            <Chip
                                                label={`Status: ${task.status}`}
                                                size="small"
                                                color={getStatusColor(task.status)}
                                            />
                                        </Box>

                                        {task.submissionUrl && (
                                            <Typography variant="body2" mt={1}>
                                                Submission: <Link href={task.submissionUrl} target="_blank" rel="noopener">View</Link>
                                            </Typography>
                                        )}
                                        {task.completionNote && (
                                            <Typography variant="body2" mt={0.5} color="success.main">
                                                Note: {task.completionNote}
                                            </Typography>
                                        )}
                                        {task.rejectNote && (
                                            <Typography variant="body2" mt={0.5} color="error.main">
                                                Rejection: {task.rejectNote}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box>
                                        <Tooltip title="View Comments">
                                            <IconButton size="small" onClick={() => handleOpenComments(task.id)}>
                                                <CommentIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Comment Dialog */}
            <Dialog open={commentOpen} onClose={() => setCommentOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Comments
                    <IconButton onClick={() => setCommentOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto', py: 2 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {comments.map((c) => (
                            <Box
                                key={c.id}
                                alignSelf={c.isMe ? 'flex-end' : 'flex-start'}
                                sx={{
                                    backgroundColor: c.isMe ? '#e3f2fd' : '#f1f1f1',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    maxWidth: '75%'
                                }}
                            >
                                <Typography variant="body2">{c.content}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {dayjs(c.createdAt).fromNow()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, py: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Type a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        size="small"
                        multiline
                        maxRows={4}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendComment();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={sendComment}
                                        disabled={commentLoading || !commentInput.trim()}
                                    >
                                        {commentLoading ? <CircularProgress size={20} /> : <SendIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AllTasks;