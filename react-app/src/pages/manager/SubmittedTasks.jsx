import { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { approveTask, fetchSubmittedTasks, rejectTask } from "../../api/managerApi";

const SubmittedTasks = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetchSubmittedTasks();
            console.log(res.data);
            setTasks(res.data || []);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchTasks().then(r => r);
    }, [fetchTasks]);

    const handleApprove = async (taskId) => {
        try {
            await approveTask(taskId);
            enqueueSnackbar('Task approved successfully!', { variant: 'success' });
            await fetchTasks();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        }
    };

    const handleRejectOpen = (taskId) => {
        setSelectedTaskId(taskId);
        setOpenRejectDialog(true);
    };

    const handleReject = async () => {
        try {
            await rejectTask(selectedTaskId, rejectReason);
            enqueueSnackbar('Task rejected successfully', { variant: 'info' });
            await fetchTasks();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setOpenRejectDialog(false);
            setRejectReason('');
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography variant="h6" align="center" mt={10}>
                    Loading submitted tasks...
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" fontWeight="bold" gutterBottom mt={4}>
                Submitted Tasks
            </Typography>

            {tasks.length === 0 ? (
                <Typography>No submitted tasks found.</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Submitted At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.assigneeName}</TableCell>
                                    <TableCell>{new Date(task.submittedAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            onClick={() => handleApprove(task.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRejectOpen(task.id)}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
                <DialogTitle>Reject Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a reason for rejecting this task:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        type="text"
                        fullWidth
                        multiline
                        minRows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReject}
                        disabled={!rejectReason.trim()}
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SubmittedTasks;