import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { getTaskById, updateTask } from '../../api/managerApi.js';
import api from '../../api/api.js';

const EditTask = ({ open, onClose, taskId, reload }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        assigneeId: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        if (!open || !taskId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [taskRes, workersRes] = await Promise.all([
                    getTaskById(taskId),
                    api.get('/users/manager/workers')
                ]);
                const taskData = taskRes.data;
                setTask({
                    title: taskData.title || '',
                    description: taskData.description || '',
                    dueDate: taskData.dueDate || '',
                    priority: taskData.priority || '',
                    assigneeId: taskData.assignee?.id || ''
                });
                setWorkers(workersRes.data || []);
            } catch (err) {
                enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData().then();
    }, [open, taskId, enqueueSnackbar]);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateTask(taskId, task);
            enqueueSnackbar('Task updated successfully!', { variant: 'success' });
            onClose();
            await reload();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            required
                            margin="normal"
                            value={task.title}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            margin="normal"
                            value={task.description}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={task.dueDate}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Priority"
                            name="priority"
                            select
                            fullWidth
                            required
                            margin="normal"
                            value={task.priority}
                            onChange={handleChange}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </TextField>

                        <TextField
                            label="Assign To"
                            name="assigneeId"
                            select
                            fullWidth
                            required
                            margin="normal"
                            value={task.assigneeId}
                            onChange={handleChange}
                        >
                            {workers.map((worker) => (
                                <MenuItem key={worker.id} value={worker.id}>
                                    {worker.name} ({worker.email})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTask;