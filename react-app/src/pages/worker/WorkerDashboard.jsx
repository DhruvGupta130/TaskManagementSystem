import {
    Container, Typography, Grid, Paper, Box, useTheme, CircularProgress,
    Button, MenuItem, ListItemText, Menu, IconButton, Badge
} from '@mui/material';
import TaskIcon from '@mui/icons-material/AssignmentTurnedIn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "../../api/userApi.js";
import { logout } from "../../store/slices/AuthSlice.js";
import api from '../../api/api.js';
import dayjs from 'dayjs';
import { Client } from '@stomp/stompjs';
import GroupIcon from '@mui/icons-material/Group';
import { WEBSOCKET_URL } from '../../api/config.js';

const options = [
    {
        title: 'My Tasks',
        description: 'View and manage your assigned tasks.',
        path: '/worker/tasks',
        icon: <TaskIcon fontSize="large" color="primary" />
    },
    {
        title: 'Manage Profile',
        description: 'See and update your profile.',
        path: '/profile',
        icon: <GroupIcon fontSize="large" color="info" />
    }
];

const WorkerDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const stompClientRef = useRef(null);
    const buttonRef = useRef(null);
    const { token } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isAll, setIsAll] = useState(false);

    const open = Boolean(anchorEl);

    const fetchUnreadNotifications = async () => {
        try {
            const res = await api.get(`/notifications/unread`);
            setNotifications(res.data || []);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        }
    };

    const fetchAllNotifications = async () => {
        try {
            const res = await api.get(`/notifications`);
            setNotifications(res.data || []);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put(`/notifications/mark-read`);
            setNotifications([]);
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        fetchUnreadNotifications().then();
    };

    const seeAllNotifications = () => {
        setIsAll(true);
        fetchAllNotifications().then();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setIsAll(false);
        markAllAsRead().then();
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    };

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

    useEffect(() => {
        const socket = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("📡 Connected to WebSocket");
                client.subscribe('/user/queue/notifications', message => {
                    const notification = JSON.parse(message.body);
                    setNotifications(prev => {
                        const exists = prev.some(n => n.id === notification.id);
                        return exists ? prev : [notification, ...prev];
                    });
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP error", frame.headers['message'], frame.body);
            },
            reconnectDelay: 5000, // reconnect every 5s
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.deactivate().then();
                console.log("🔌 WebSocket disconnected");
            }
        };
    }, [token]);

    return (
        <Container sx={{ mt: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Welcome, Worker</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your task workspace</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                        color="primary"
                        onClick={handleMenuOpen}
                        ref={buttonRef}
                        disabled={loading}
                    >
                        <Badge badgeContent={isAll ? 0 : notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        disableAutoFocusItem
                        slotProps={{
                            paper: {
                                sx: {
                                    minWidth: 350, // <-- Apply width here
                                    maxHeight: 400, // optional: scrollable max height
                                }
                            }
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {notifications.length === 0 ? (
                            <MenuItem disabled>
                                <ListItemText sx={{ width: '100%', textAlign: 'center' }} primary="No new notifications" />
                            </MenuItem>
                        ) : (
                            notifications.map((n, i) => (
                                <MenuItem
                                    key={i}
                                    onClick={handleMenuClose}
                                    sx={{
                                        backgroundColor: n.read ? 'transparent' : 'rgba(25, 118, 210, 0.1)',
                                        fontWeight: n.read ? 'normal' : 'bold',
                                        color: n.read ? 'text.secondary' : 'text.primary'
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                                        <ListItemText
                                            primary={n.message}
                                            secondary={dayjs(n.createdAt).fromNow()}
                                        />
                                        {!n.read && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                        <Button
                            variant="text"
                            size='small'
                            onClick={isAll ? handleMenuClose : seeAllNotifications}
                            color={isAll ? 'error' : 'primary'}
                            sx={{ width: '100%', justifyContent: 'center', mt: 1, fontSize: '0.675rem' }}
                        >
                            {isAll ? 'Close' : 'View All Notifications'}
                        </Button>
                    </Menu>
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
            </Box>

            <Grid container spacing={4}>
                {options.map((opt, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: '0.3s',
                                backgroundColor: '#fafafa',
                                '&:hover': {
                                    boxShadow: `0 8px 24px ${theme.palette.primary.main}33`,
                                    transform: 'translateY(-4px)'
                                }
                            }}
                            onClick={() => navigate(opt.path)}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                {opt.icon}
                                <Typography variant="h6" ml={2} fontWeight={600}>
                                    {opt.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">{opt.description}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WorkerDashboard;