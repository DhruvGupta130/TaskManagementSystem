import { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    useTheme, Button, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/AuthSlice.js";
import { logoutUser } from "../../api/userApi.js";
import { useSnackbar } from "notistack";

const options = [
    {
        title: 'Assign Task',
        description: 'Assign new tasks to workers.',
        path: '/manager/assign',
        icon: <AssignmentIcon fontSize="large" color="primary" />
    },
    {
        title: 'All Tasks',
        description: 'View all tasks assigned by you.',
        path: '/manager/tasks',
        icon: <ListAltIcon fontSize="large" color="primary" />
    },
    {
        title: 'Submitted Tasks',
        description: 'Review submitted tasks by workers.',
        path: '/manager/submitted-tasks',
        icon: <TaskAltIcon fontSize="large" color="success" />
    },
    {
        title: 'Extension Requests',
        description: 'Approve or reject extension requests.',
        path: '/manager/extension-requests',
        icon: <AccessTimeIcon fontSize="large" color="warning" />
    },
    {
        title: 'Manage Profile',
        description: 'See and update your profile.',
        path: '/profile',
        icon: <GroupIcon fontSize="large" color="info" />
    }
];

const ManagerDashboard = () => {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await logoutUser();
            dispatch(logout());
            enqueueSnackbar(response.data?.message, { variant: 'success' });
            navigate('/login');
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={600}>
                        Welcome, Manager
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Control your workflow and team from here.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {loading ? 'Logging out...' : 'Logout'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {options.map((option, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Paper
                            elevation={3}
                            onClick={() => navigate(option.path)}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                cursor: 'pointer',
                                transition: '0.2s',
                                '&:hover': {
                                    boxShadow: `0 6px 20px ${theme.palette.primary.main}30`,
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box mb={2} display="flex" alignItems="center">
                                {option.icon}
                                <Typography variant="h6" ml={2}>
                                    {option.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {option.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ManagerDashboard;