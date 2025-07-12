import { useEffect, useState } from 'react';
import {
    fetchExtensionRequests,
    approveExtension,
    rejectExtension
} from '../../api/managerApi';
import {
    Container,
    Paper,
    Typography,
    Button,
    TextField,
    Box,
    CircularProgress,
    Grid
} from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

const ExtensionRequests = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [requests, setRequests] = useState([]);
    const [reasons, setReasons] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchExtensionRequests();
                setRequests(res.data || []);
            } catch (err) {
                enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        load().then();
    }, [enqueueSnackbar]);

    const handleApprove = async (id) => {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        try {
            await approveExtension(id);
            enqueueSnackbar('Request approved.', { variant: 'success' });
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleReject = async (id) => {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        try {
            await rejectExtension(id, reasons[id] || 'No reason provided');
            enqueueSnackbar('Request rejected.', { variant: 'info' });
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Extension Requests
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : requests.length === 0 ? (
                <Typography variant="body1" color="text.secondary" mt={3}>
                    No pending extension requests.
                </Typography>
            ) : (
                requests.map((req) => (
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            my: 2,
                            borderRadius: 3,
                            backgroundColor: '#f9fafb',
                            transition: '0.3s',
                            '&:hover': {
                                boxShadow: 6,
                                backgroundColor: '#ffffff',
                            }
                        }}
                        key={req.id}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            {req.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Assignee ID: <strong>{req.assigneeId}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Original Deadline: <strong>{dayjs(req.originalDeadline).format('MMM D, YYYY')}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Requested Extension: <strong>{dayjs(req.requestedDeadline).format('MMM D, YYYY')}</strong>
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm="auto">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(req.id)}
                                    disabled={actionLoading[req.id]}
                                >
                                    {actionLoading[req.id] ? 'Approving...' : 'Approve'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Rejection Reason"
                                    size="small"
                                    fullWidth
                                    placeholder="Optional but recommended"
                                    value={reasons[req.id] || ''}
                                    onChange={(e) =>
                                        setReasons({ ...reasons, [req.id]: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleReject(req.id)}
                                    disabled={actionLoading[req.id] || !reasons[req.id]?.trim()}
                                >
                                    {actionLoading[req.id] ? 'Rejecting...' : 'Reject'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            )}
        </Container>
    );
};

export default ExtensionRequests;