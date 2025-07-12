import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    Link
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../store/slices/AuthSlice.js";
import loginApi from "../api/loginApi.js";

const Login = () => {
    const userRole = useSelector(state => state.auth.userRole);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const roleRoutes = {
            MANAGER: '/manager/dashboard',
            WORKER: '/worker/dashboard',
            ADMIN: '/admin',
        };
        const path = roleRoutes[userRole];
        if (path) navigate(path);
    }, [userRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            enqueueSnackbar('Email and password are required', { variant: 'warning' });
            return;
        }
        setLoading(true);
        try {
            const res = await loginApi.post('/auth/login', { email, password });
            const { message, data } = res.data;
            const { accessToken, role } = data;
            dispatch(login({ token: accessToken, role: role }));
            enqueueSnackbar(message || 'Login successful', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ padding: 5, mt: 10, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                    Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" mb={3}>
                    Please enter your credentials to log in.
                </Typography>

                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        required
                        margin="normal"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        fullWidth
                        required
                        margin="normal"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 1 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </Box>

                <Typography variant="body2" align="center" mt={2}>
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                        Register here
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;