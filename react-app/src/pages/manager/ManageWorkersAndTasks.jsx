import React, { useCallback, useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, CircularProgress, Box, MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../../api/api';
import { assignTask } from '../../api/managerApi';

const ManageWorkersAndTasks = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: ''
    });

    const loadWorkers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/manager/workers');
            setWorkers(res.data || []);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadWorkers();
    }, [loadWorkers]);

    const handleAssignClick = (worker) => {
        setSelectedWorker(worker);
        setForm({
            title: '',
            description: '',
            dueDate: '',
            priority: ''
        });
        setOpenDialog(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const { title, dueDate, priority } = form;
        if (!title || !dueDate || !priority) {
            return enqueueSnackbar('All fields except description are required', { variant: 'warning' });
        }

        setSubmitLoading(true);
        try {
            await assignTask({
                ...form,
                assigneeId: selectedWorker.id
            });
            enqueueSnackbar('Task assigned successfully', { variant: 'success' });
            setOpenDialog(false);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Manage Workers & Assign Tasks
            </Typography>

            {loading ? (
                <Box mt={4} display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workers.map((worker) => (
                                <TableRow key={worker.id}>
                                    <TableCell>{worker.name}</TableCell>
                                    <TableCell>{worker.email}</TableCell>
                                    <TableCell>{worker.role}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" onClick={() => handleAssignClick(worker)}>
                                            Assign Task
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Assign Task Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Task to {selectedWorker?.name}</DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <TextField
                            label="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            value={form.dueDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Priority"
                            name="priority"
                            select
                            fullWidth
                            required
                            margin="normal"
                            value={form.priority}
                            onChange={handleChange}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} disabled={submitLoading}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitLoading}>
                        {submitLoading ? <CircularProgress size={20} /> : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageWorkersAndTasks;