import {
    Container, Typography, Grid, Paper, Box, IconButton,
    Button, Chip, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Divider, Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../api/api';
import dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

const isOverdue = (dueDateStr) => new Date(dueDateStr) < new Date();

const MyWorkerTasks = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [submitNote, setSubmitNote] = useState('');
    const [submitUrl, setSubmitUrl] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);
    const [extensionReason, setExtensionReason] = useState('');
    const [requestedDate, setRequestedDate] = useState('');
    const [extensionLoading, setExtensionLoading] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [activeComments, setActiveComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await api.get('/tasks/worker/tasks');
                setTasks(res.data);
            } catch (err) {
                enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const refreshTasks = async () => {
        setLoading(true);
        const res = await api.get('/tasks/worker/tasks');
        setTasks(res.data);
        setLoading(false);
    };

    const handleOpenSubmit = (task) => {
        setSelectedTask(task);
        setSubmitNote('');
        setSubmitUrl('');
        setSubmitDialogOpen(true);
    };

    const handleSubmitTask = async () => {
        if (!submitUrl.trim()) {
            enqueueSnackbar("Submission URL is required", { variant: "warning" });
            return;
        }
        setSubmitLoading(true);
        try {
            await api.put(`/tasks/worker/submit/${selectedTask.id}`, {
                notes: submitNote,
                submissionUrl: submitUrl
            });
            enqueueSnackbar("Task submitted successfully!", { variant: "success" });
            setSubmitDialogOpen(false);
            setSelectedTask(null);
            await refreshTasks();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleOpenExtension = (task) => {
        setSelectedTask(task);
        setExtensionReason('');
        setRequestedDate('');
        setExtensionDialogOpen(true);
    };

    const handleRequestExtension = async () => {
        if (!extensionReason.trim() || !requestedDate) {
            enqueueSnackbar("Please fill all extension details", { variant: "warning" });
            return;
        }
        setExtensionLoading(true);
        try {
            const res = await api.post(`/tasks/worker/${selectedTask.id}/request-extension`, {
                reason: extensionReason,
                requestedDueDate: requestedDate
            });
            enqueueSnackbar(res.data.message, { variant: "success" });
            setExtensionDialogOpen(false);
            await refreshTasks();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setExtensionLoading(false);
        }
    };

    const handleOpenComments = async (task) => {
        setSelectedTask(task);
        setCommentDialogOpen(true);
        try {
            const res = await api.get(`/comments/${task.id}`);
            setActiveComments(res.data);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        }
    };

    const handleSendComment = async () => {
        if (!commentInput.trim()) return;
        setCommentLoading(true);
        try {
            await api.post(`/comments/${selectedTask.id}`, commentInput, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setActiveComments((prev) => [...prev, {
                id: Date.now(),
                isMe: true,
                content: commentInput,
                createdAt: new Date().toISOString()
            }]);
            setCommentInput('');
            enqueueSnackbar("Comment sent", { variant: "success" });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                My Assigned Tasks
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
            ) : tasks.length === 0 ? (
                <Typography mt={4} color="text.secondary">No tasks assigned yet.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map(task => {
                        const isSubmittedOrCompleted = ['SUBMITTED', 'COMPLETED'].includes(task.status);
                        const overdue = isOverdue(task.dueDate) && !isSubmittedOrCompleted;
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                                <Paper elevation={3} sx={{
                                    p: 3, borderRadius: 3,
                                    border: overdue ? '2px solid red' : '1px solid #e0e0e0',
                                    backgroundColor: overdue ? '#fff3f3' : '#fdfdfd',
                                    height: '100%',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: '0.25s ease' }
                                }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>{task.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" mb={1}>{task.description}</Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1.5} mb={1.5}>
                                            <Chip label={task.status} color={
                                                task.status === 'COMPLETED' ? 'success' :
                                                    task.status === 'ASSIGNED' ? 'warning' :
                                                        task.status === 'REASSIGNED' ? 'error' : 'info'
                                            } size="small" />
                                            <Chip label={`Priority: ${task.priority}`} color={
                                                task.priority === 'HIGH' ? 'error' :
                                                    task.priority === 'MEDIUM' ? 'warning' : 'default'
                                            } size="small" variant="outlined" />
                                            <Chip label={`Due: ${task.dueDate}`} size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Assigned by: <strong>{task.manager?.name}</strong> ({task.manager?.email})
                                        </Typography>
                                        <Divider sx={{ my: 1.5 }} />
                                    </Box>

                                    <Stack spacing={1}>
                                        <Button
                                            variant="contained"
                                            startIcon={<TaskAltIcon />}
                                            disabled={isSubmittedOrCompleted}
                                            onClick={() => handleOpenSubmit(task)}
                                            fullWidth
                                        >
                                            {isSubmittedOrCompleted ? task.status : 'Submit Task'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ChatBubbleOutlineIcon />}
                                            onClick={() => handleOpenComments(task)}
                                            fullWidth
                                        >
                                            View Comments
                                        </Button>
                                        {overdue && (
                                            <Button
                                                variant="text"
                                                startIcon={<AccessTimeIcon />}
                                                onClick={() => handleOpenExtension(task)}
                                                sx={{ color: 'warning.main' }}
                                                fullWidth
                                            >
                                                Request Extension
                                            </Button>
                                        )}
                                    </Stack>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Submit Task - {selectedTask?.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Submission Notes"
                        value={submitNote}
                        onChange={(e) => setSubmitNote(e.target.value)}
                        multiline rows={3} margin="normal"
                    />
                    <TextField
                        fullWidth label="Submission URL" required
                        value={submitUrl}
                        onChange={(e) => setSubmitUrl(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSubmitDialogOpen(false)} disabled={submitLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmitTask} disabled={submitLoading}>
                        {submitLoading ? <CircularProgress size={20} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Extension Dialog */}
            <Dialog open={extensionDialogOpen} onClose={() => setExtensionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Extension - {selectedTask?.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Reason for Extension"
                        value={extensionReason}
                        onChange={(e) => setExtensionReason(e.target.value)}
                        multiline rows={3} margin="normal"
                    />
                    <TextField
                        fullWidth label="Requested New Due Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={requestedDate}
                        onChange={(e) => setRequestedDate(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExtensionDialogOpen(false)} disabled={extensionLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleRequestExtension} disabled={extensionLoading}>
                        {extensionLoading ? <CircularProgress size={20} /> : 'Send Request'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Comment Dialog */}
            <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Comments - {selectedTask?.title}
                    <IconButton onClick={() => setCommentDialogOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {activeComments.map((c, idx) => (
                            <Box
                                key={idx}
                                alignSelf={c.isMe ? 'flex-end' : 'flex-start'}
                                sx={{
                                    backgroundColor: c.isMe ? '#e3f2fd' : '#f1f1f1',
                                    px: 2, py: 1,
                                    borderRadius: 2,
                                    maxWidth: '75%',
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
                <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Type a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        size="small"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendComment();
                            }
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSendComment}
                                            disabled={commentLoading || !commentInput.trim()}
                                        >
                                            {commentLoading ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <SendIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyWorkerTasks;